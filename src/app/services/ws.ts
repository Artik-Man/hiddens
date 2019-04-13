import { Injectable } from '@angular/core';
import { Message, WSMessage } from '../models/message';

interface WSSubscriptions {
  message?: (msg: Message) => void;
  error?: (err: Event) => void;
  open?: () => void;
  close?: () => void;
}

@Injectable()
export class WebSocketPostService {
  public url: string;
  public status = WebSocket.CLOSED;
  private xid: string;
  private connection: WebSocket;
  private messageQueue: WSMessage[] = [];
  private currentSubs: WSSubscriptions;

  constructor() { }

  public connect(url: string, xid?: string): WebSocketPostService {
    this.url = url;
    if (xid.length) {
      this.xid = xid;
    }
    if (!this.connection || this.connection.readyState === WebSocket.CLOSED) {
      this.connection = new WebSocket(this.url, this.xid);
      this.status = this.connection.readyState;
      this.connection.onopen = () => {
        this.checkQueue();
        this.status = this.connection.readyState;
        if (this.currentSubs) {
          this.subscribe(this.currentSubs);
        }
      };
    }
    return this;
  }

  public send(message: WSMessage): WebSocketPostService {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
      this.connect(this.url, this.xid);
    }
    this.status = this.connection.readyState;
    return this;
  }

  public close(): WebSocketPostService {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.close();
    }
    this.status = this.connection.readyState;
    return this;
  }


  public subscribe(subs: WSSubscriptions) {
    this.currentSubs = subs;
    if (subs.message) {
      this.connection.onmessage = (msg: MessageEvent) => {
        this.status = this.connection.readyState;
        const message = new Message(msg.data);
        subs.message(message);
      };
    }
    if (subs.open) {
      this.connection.onopen = () => {
        this.status = this.connection.readyState;
        this.checkQueue();
        subs.open();
      };
    }
    if (subs.error) {
      this.connection.onerror = (err: Event) => {
        this.status = this.connection.readyState;
        this.connect(this.url, this.xid);
        subs.error(err);
      };
    }
    if (subs.close) {
      this.connection.onclose = () => {
        this.status = this.connection.readyState;
        this.connect(this.url, this.xid);
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
