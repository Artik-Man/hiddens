import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, SimpleUser } from 'src/app/models/user';
import { WSMessage } from 'src/app/models/message';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-main',
  templateUrl: './template.html',
  styleUrls: ['./styles.less']
})
export class MainComponent {
  @Input() users: User[] = [];
  @Input() me: SimpleUser;
  @Output() message = new EventEmitter<WSMessage>();
  @ViewChild(MatSidenav) drawer: MatSidenav;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  public selectedUser: User;

  constructor(private breakpointObserver: BreakpointObserver) {
    console.log(this);
  }

  public sendMessage(msg: WSMessage) {
    this.message.emit(msg);
  }

  public closeNav() {
    this.isHandset$.subscribe(handset => {
      if (handset) {
        this.drawer.close();
      }
    });
  }

  public onResize() {
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.drawer.open();
      }
    });
  }
}
