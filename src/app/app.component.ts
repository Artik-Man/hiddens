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
    private state: StateService
  ) {
    console.log(this);
    const localInfo = this.state.getLocalInfo();

    if (localInfo.name && localInfo.name.length) {
      this.me = this.state.getMe();
      this.startMessaging = true;
    }

    this.state.updateUsers.subscribe(users => {
      this.users = users;
    });

    this.state.updateMe.subscribe(me => {
      this.me = me;
    });
  }

  public sendMessage(message: WSMessage) {
    this.state.sendMessage(message);
  }

  public onResize(event) {
    this.ios_height_fix = window.innerHeight + 'px';
  }

  public start() {
    this.startMessaging = this.nickname.length >= 3;
    if (this.startMessaging) {
      this.state.setMe({ name: this.nickname });
    }
  }

}
