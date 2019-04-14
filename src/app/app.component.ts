import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state';
import { WSMessage } from './models/message';
import { User, SimpleUser } from './models/user';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public users: User[] = [];
  public me: SimpleUser;
  public ios_height_fix = '100vh';
  public startMessaging = false;
  public nickname = '';

  constructor(
    private state: StateService,
    private swUpdate: SwUpdate
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

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
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
