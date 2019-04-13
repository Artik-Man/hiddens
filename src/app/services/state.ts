import { Injectable, EventEmitter } from '@angular/core';
import { Message, WSMessage, MessageData } from '../models/message';
import { User, SimpleUser } from '../models/user';
import { WebSocketPostService } from './ws';

export interface LocalInfo {
  id: string;
  name: string;
}

@Injectable()
export class StateService {
  public updateUsers = new EventEmitter<User[]>();
  public updateMe = new EventEmitter<SimpleUser>();

  private users: User[] = [];
  private me: SimpleUser = new SimpleUser('');

  constructor(private wsps: WebSocketPostService) {
    console.log(this);
    const localInfo = this.getLocalInfo();
    this.me.id = localInfo.id;
    this.me.name = localInfo.name;
    this.wsps
      .connect('wss://ws-post.herokuapp.com/', this.me.id)
      .subscribe({
        message: msg => {
          this.parseMessage(msg);
        }
      });

    this.loopPing();
  }

  public parseMessage(message: Message) {
    console.log(message);
    if (!message) {
      return;
    }
    if (message.connections.length) {
      const users = this.users.map(user => user.id);
      const deleteUsers = [];
      const newUsers = message.connections
        .filter(con => {
          if (!users.includes(con)) {
            return true;
          }
          deleteUsers.push(con);
          return false;
        })
        .map(con => new User(con));
      deleteUsers.forEach(u => {
        u.connected = false;
      });
      this.users = this.users.filter(u => !deleteUsers.includes(u.id)).concat(newUsers);
      this.updateUsers.emit(this.users);
      if (this.me.name && this.me.name.length) {
        this.users.forEach(u => {
          this.wsps.send(new WSMessage(u.id, new MessageData({ name: this.me.name })));
        });
      }
    }
    if (message.connected) {
      this.users.push(new User(message.connected));
      this.updateUsers.emit(this.users);
      this.wsps.send(new WSMessage(message.connected, new MessageData({ name: this.me.name })));
    }
    if (message.disconnected) {
      const user = this.users.find(u => u.id === message.disconnected);
      if (user) {
        user.connected = false;
      }
      this.users = this.users.filter(u => u.id !== message.disconnected);
      this.updateUsers.emit(this.users);
    }
    if (message.from && message.from === 'SERVER' && message.to) {
      const localInfo = this.getLocalInfo();
      localInfo.id = message.to;
      this.setLocalInfo(localInfo);
    } else if (message.from) {
      let user = this.users.find(u => u.id === message.from);
      if (!user) {
        user = new User(message.from);
        this.users.push(user);
        this.updateUsers.emit(this.users);
      }
      if (message.data) {
        if (typeof message.data === 'object') {
          if (message.data.text && typeof message.data.text === 'string') {
            user.messages = [message];
          }
          if (message.data.name && typeof message.data.name === 'string') {
            user.name = message.data.name;
          }
        }
      }
    }
    if (message.to) {
      if (this.me.id !== message.to) {
        this.setMe({ id: message.to });
        this.updateMe.emit(this.me);
      }
    }
  }

  public sendMessage(message: WSMessage) {
    if (!message.to) {
      return;
    }
    if (!message.data) {
      return;
    }
    const user = this.users.find(u => u.id === message.to);
    if (!user) {
      return;
    }
    const msg = message.toMessage();
    user.messages = [msg];

    this.wsps.send(message);
  }

  public getMe(): SimpleUser {
    return this.me;
  }

  public setMe(info: { id?: string, name?: string }) {
    if (!this.me) {
      this.me = new SimpleUser(info.id || '');
    }
    if (info.id) {
      this.me.id = info.id;
    }
    if (info.name) {
      this.me.name = info.name;
    }
    this.setLocalInfo({
      id: this.me.id,
      name: this.me.name
    });
    this.updateMe.emit(this.me);
    if (this.me.name && this.me.name.length) {
      this.users.forEach(u => {
        this.wsps.send(new WSMessage(u.id, new MessageData({ name: this.me.name })));
      });
    }
  }

  public getLocalInfo(): LocalInfo {
    return JSON.parse(localStorage.getItem('wsp.user') || JSON.stringify({ name: '', id: '' }));
  }

  public setLocalInfo(info: LocalInfo) {
    const inf = {};
    Object.keys(info).forEach(k => {
      if (info[k]) {
        inf[k] = info[k];
      }
    });
    const localInfo = Object.assign({}, this.getLocalInfo(), inf);
    localStorage.setItem('wsp.user', JSON.stringify(localInfo));
  }

  private loopPing() {
    if (this.wsps.status === WebSocket.OPEN) {
      this.wsps.send(new WSMessage('SERVER', 'ping'));
    }
    setTimeout(() => {
      this.loopPing();
    }, 10000);
  }
}


