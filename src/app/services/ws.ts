import { Injectable } from '@angular/core';
import { Message, WSMessage } from '../models/message';
import { StateService, LocalInfo } from './state';

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

  private connection: WebSocket;
  private messageQueue: WSMessage[] = [];
  private currentSubs: WSSubscriptions;
  private localInfo: LocalInfo;

  constructor(private state: StateService) {
    this.localInfo = this.state.getLocalInfo();
  }

  public connect(url: string): WebSocketPostService {
    this.url = url;
    if (!this.connection || this.connection.readyState === WebSocket.CLOSED) {
      const xid = this.localInfo.id.length ? [this.localInfo.id] : [];
      this.connection = new WebSocket(this.url, xid);
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
    if (subs.error) {
      this.connection.onerror = (err: Event) => {
        this.status = this.connection.readyState;
        subs.error(err);
      };
    }
    if (subs.open) {
      this.connection.onopen = () => {
        this.status = this.connection.readyState;
        this.checkQueue();
        subs.open();
      };
    }
    if (subs.close) {
      this.connection.onclose = () => {
        this.status = this.connection.readyState;
        this.connect(this.url);
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
