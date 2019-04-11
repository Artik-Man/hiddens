import { Message } from './message';

export class User {
  public id: string;
  public name: string;
  public messages: Message[];
  public lastMessageDate: Date;
  constructor(id: string) {
    this.id = id;
  }

  public setMessages(messages: Message[]) {
    messages.forEach(mess => {
      this.messages.push(mess);
    });
    if (messages.length) {
      this.lastMessageDate = messages[messages.length - 1].date;
    }
  }

}
