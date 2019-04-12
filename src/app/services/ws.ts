import { Injectable } from '@angular/core';
import { Message, WSMessage } from '../models/message';

@Injectable()
export class WebSocketPostService {
  public url: string;
  private connection: WebSocket;
  private messageQueue: WSMessage[] = [];

  constructor() { }

  public connect(url: string): WebSocketPostService {
    this.url = url;
    if (!this.connection || this.connection.readyState === WebSocket.CLOSED) {
      this.connection = new WebSocket(this.url);
      this.connection.onopen = () => {
        this.checkQueue();
      };
    }
    return this;
  }

  public send(message: WSMessage): WebSocketPostService {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
    return this;
  }

  public close(): WebSocketPostService {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.close();
    }
    return this;
  }

  public subscribe(subs: {
    message?: (msg: Message) => void,
    error?: (err: Event) => void,
    open?: () => void,
    close?: () => void
  }) {
    if (subs.message) {
      this.connection.onmessage = (msg: MessageEvent) => {
        const message = new Message(msg.data);
        subs.message(message);
      };
    }
    if (subs.error) {
      this.connection.onerror = (err: Event) => {
        subs.error(err);
      };
    }
    if (subs.open) {
      this.connection.onopen = () => {
        this.checkQueue();
        subs.open();
      };
    }
    if (subs.close) {
      this.connection.onclose = () => {
        subs.close();
      };
    }
  }

  private checkQueue() {
    if (this.messageQueue.length && this.connection && this.connection.OPEN) {
      const queue = this.messageQueue.slice();
      while (queue.length) {
        this.send(queue.shift());
      }
    }
  }

}
 