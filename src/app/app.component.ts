import { Component } from '@angular/core';
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public users = [];

  constructor(
    private wsps: WebSocketPostService,
    private state: StateService
  ) {
    this.wsps
      .connect('wss://ws-post.herokuapp.com/')
      .send({ to: 'SERVER', data: 'ping' })
      .subscribe({
        message: msg => {
          this.state.parseMessage(msg);
        }
      });

    this.state.updateUsers.subscribe(users => {
      this.users = users;
    });

  }

}
