import { Message } from './message';
import { EventEmitter } from '@angular/core';

export class SimpleUser {
  public id: string;

  private _name: string;
  public set name(name: string) {
    this._name = name;
  }
  public get name(): string {
    return this._name;
  }

  constructor(id: string) {
    this.id = id;
  }

  public toString(): string {
    return this.id;
  }
}

export class User extends SimpleUser {
  public newMessage = new EventEmitter<Message>();
  public lastMessageDate: Date;

  private _messages: Message[] = [];
  public set messages(messages: Message[]) {
    messages.forEach(mess => {
      this._messages.push(mess);
      this.newMessage.emit(mess)
    });
    if (messages.length) {
      this.lastMessageDate = messages[messages.length - 1].date;
    }
  }
  public get messages(): Message[] {
    return this._messages;
  }

}

