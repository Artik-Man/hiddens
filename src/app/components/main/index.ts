import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { WSMessage } from 'src/app/models/message';

@Component({
  selector: 'app-main',
  templateUrl: './template.html',
  styleUrls: ['./styles.less']
})
export class MainComponent {
  @Input() users: User[] = [];
  @Output() message = new EventEmitter<WSMessage>();

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  public selectedUser: User;

  constructor(private breakpointObserver: BreakpointObserver) {
    console.log(this);
  }

  public sendMessage(msg: WSMessage) {
    this.message.emit(msg);
  }

}
