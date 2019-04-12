import { Component } from '@angular/core';
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
import { WSMessage } from './models/message';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public users: User[] = [];
  public selectedUser: User;

  constructor(
    private wsps: WebSocketPostService,
    private state: StateService
  ) {
    console.log(this);
    this.wsps
      .connect('wss://ws-post.herokuapp.com/')
      .send(new WSMessage('SERVER', 'ping'))
      .subscribe({
        message: msg => {
          this.state.parseMessage(msg);
        }
      });

    this.state.updateUsers.subscribe(users => {
      this.users = users;
    });

  }

  public sendMessage(message: WSMessage) {
    const msg = this.state.inputMessage(message);
    if (msg) {
      this.wsps.send(msg);
    }
  }
}
