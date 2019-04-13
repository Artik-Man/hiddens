import { Component } from '@angular/core';
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
import { WSMessage } from './models/message';
import { User, SimpleUser } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public users: User[] = [];
  public me: SimpleUser;
  public ios_height_fix = '100vh';

  constructor(
    private wsps: WebSocketPostService,
    private state: StateService
  ) {
    console.log(this);

    this.wsps
      .connect('wss://ws-post.herokuapp.com/')
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

  public sendMessage(message: WSMessage) {
    const msg = this.state.inputMessage(message);
    if (msg && msg.data.length) {
      this.wsps.send(msg);
    }
  }

  public onResize(event) {
    this.ios_height_fix = window.innerHeight + 'px';
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
