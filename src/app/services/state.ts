import { Injectable, EventEmitter } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable()
export class StateService {
  public updateUsers = new EventEmitter<User[]>();
  private users: User[] = [];

  constructor() {
    console.log(this);

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
    if (message.disconneced) {
      this.users = this.users.filter(u => u.id !== message.disconneced);
      this.updateUsers.emit(this.users);
    }
    if (message.from && message.from !== 'SERVER') {

    }
  }


}
