import { Component } from '@angular/core';
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
import { WSMessage, MessageData } from './models/message';
import { User, SimpleUser } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public users: User[] = [];
  public me: SimpleUser;
  public ios_height_fix = '100vh';
  public startMessaging = false;
  public nickname = '';

  constructor(
    private wsps: WebSocketPostService,
    private state: StateService
  ) {
    console.log(this);
    const localInfo = this.state.getLocalInfo();
    if (localInfo.name.length) {
      this.startMessaging = true;
      this.state.setMe(localInfo);
      this.me = new SimpleUser(localInfo.id);
      this.me.name = localInfo.name;
      this.startServices();
    }
  }

  public sendMessage(message: WSMessage) {
    const msg = this.state.inputMessage(message);
    if (msg && msg.data instanceof MessageData && msg.data.text.length) {
      this.wsps.send(msg);
    }
  }

  public onResize(event) {
    this.ios_height_fix = window.innerHeight + 'px';
  }

  private startServices() {
    this.wsps
      .connect('ws://ws-post.herokuapp.com/')
      .subscribe({
        message: msg => {
          this.state.parseMessage(msg);
        }
      });

    this.loopPing();

    this.state.updateUsers.subscribe(users => {
      this.users = users;
    });

    this.state.updateMe.subscribe(me => {
      this.me = me;
    });

  }

  public start() {
    this.startMessaging = this.nickname.length >= 3;
    if (this.startMessaging) {
      this.state.setMe({ name: this.nickname });
      this.startServices();
    }
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
