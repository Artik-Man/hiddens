export class WSMessage {
  public to: string;
  public data: any;
  constructor(to: string, data: any) {
    this.to = to;
    this.data = data;
  }

  toMessage(): Message {
    return new Message(JSON.stringify({
      to: this.to,
      data: this.data
    }));
  }
}

export class Message {
  public date: Date;
  public from: string;
  public to: string;
  public data: any;
  public error: string;
  public status: number;
  public connections: string[];
  public connected: string;
  public disconnected: string;
  constructor(msg: string) {
    try {
      const message = JSON.parse(msg);
      if (message) {
        this.date = new Date();
        this.from = message.from || null;
        this.to = message.to || null;
        this.data = message.data || null;
        this.error = message.error || null;
        this.connections = message.connections || [];
        this.connected = message.connected || null;
        this.disconnected = message.disconnected || null;
      }
    } catch (e) { }
  }
}
