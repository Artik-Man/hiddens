import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { WSMessage, MessageData } from 'src/app/models/message';
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
  @ViewChild('chatContainer') private chatContainer: ElementRef;

  public messageText = '';

  private subs: Subscription;

  constructor() {
    console.log(this);
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }

  public submit() {
    const message = this.messageText
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/(^\n+)|(\n+$)/g, '')
      .replace(/\n{3,}/g, '\n\n');
    if (message.length) {
      const msg = new MessageData({ text: message });
      this.message.emit(new WSMessage(this.user.toString(), msg));
      this.messageText = '';
    }
  }

  public onType(e: KeyboardEvent) {
    const textarea: HTMLElement = e.target as HTMLElement;
    textarea.style.height = textarea.scrollHeight + 'px';
    if (e.key === 'Enter' && !e.shiftKey) {
      this.submit();
      textarea.style.height = '0';
    }
    ((this.chatContainer.nativeElement) as HTMLElement).style.paddingBottom = 50 + textarea.offsetHeight + 'px';
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
        if (force || document.body.offsetHeight - (window.innerHeight + window.scrollY) < 300) {
          window.scrollTo(0, document.body.offsetHeight);
        }
      } catch (err) { }
    }, 10);
  }

}
