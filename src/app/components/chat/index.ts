import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { WSMessage } from 'src/app/models/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: 'template.html',
  styleUrls: ['./styles.less']
})

export class ChatComponent implements OnDestroy {
  private _user: User;
  @Input() set user(u: User) {
    if (u) {
      this._user = u;
      this._user.unread = false;
      this.subscribe();
      this.scrollToBottom(true);
    }
  }
  get user(): User {
    return this._user;
  }

  @Output() message = new EventEmitter<WSMessage>();
  @ViewChild('scroll') private scroll: ElementRef;

  public messageText = '';

  private subs: Subscription;

  constructor() {
    console.log(this);
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }

  public submit() {
    if (this.messageText.length) {
      this.message.emit(new WSMessage(this.user.toString(), this.messageText));
      this.messageText = '';
    }
  }

  public updateTextareaSize(e: KeyboardEvent) {
    const textarea: HTMLElement = e.target as HTMLElement;
    textarea.style.height = textarea.scrollHeight + 'px';
    if (e.key === 'Enter' && !e.shiftKey) {
      this.submit();
      textarea.style.height = '0';
    }
  }

  private subscribe() {
    this.subs && this.subs.unsubscribe();
    if (this._user) {
      this.subs = this._user.newMessage.subscribe(() => {
        this.scrollToBottom();
        this._user.unread = false;
      });
    }
  }

  private scrollToBottom(force = false) {
    setTimeout(() => {
      try {
        const element = this.scroll.nativeElement;
        if (force || element.scrollTop > element.scrollHeight - element.offsetHeight - 300) {
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) { }
    }, 10);
  }

}
