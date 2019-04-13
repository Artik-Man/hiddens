import { Injectable, EventEmitter } from '@angular/core';
import { Message, WSMessage } from '../models/message';
import { User, SimpleUser } from '../models/user';

@Injectable()
export class StateService {
  public updateUsers = new EventEmitter<User[]>();
  public updateMe = new EventEmitter<SimpleUser>();

  private users: User[] = [];
  private me: SimpleUser;

  constructor() {
    console.log(this);
  }

  public inputMessage(message: WSMessage) {
    if (message.to && message.data) {
      const user = this.users.find(u => u.id === message.to);
      if (!user) {
        return null;
      }
      const msg = message.toMessage();
      user.messages = [msg];
      return message;
    }
    return null;
  }

  public parseMessage(message: Message) {
    console.log(message);
    if (!message) {
      return;
    }
    if (message.connections) {
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
      this.users = this.users.filter(u => !deleteUsers.includes(u.id)).concat(newUsers);
      this.updateUsers.emit(this.users);
    }
    if (message.connected) {
      this.users.push(new User(message.connected));
      this.updateUsers.emit(this.users);
    }
    if (message.disconnected) {
      this.users = this.users.filter(u => u.id !== message.disconnected);
      this.updateUsers.emit(this.users);
    }
    if (message.from && message.from !== 'SERVER') {
      let user = this.users.find(u => u.id === message.from);
      if (!user) {
        user = new User(message.from);
        this.users.push(user);
        this.updateUsers.emit(this.users);
      }
      if (message.data && typeof message.data === 'string') {
        user.messages = [message];
      }
    }
    if (message.to) {
      if (!this.me) {
        this.me = new SimpleUser(message.to);
        this.updateMe.emit(this.me);
      } else if (this.me.id !== message.to) {
        this.me.id = message.to;
        this.updateMe.emit(this.me);
      }
    }
  }


}
