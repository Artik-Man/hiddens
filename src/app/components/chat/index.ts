import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewChecked, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { WSMessage } from 'src/app/models/message';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: 'template.html'
})

export class ChatComponent implements OnDestroy {
  private _user: User;
  @Input() set user(u: User) {
    this._user = u;
    this.subscribe();
    this.scrollToBottom(true);
  }
  get user(): User {
    return this._user;
  }

  @Output() message = new EventEmitter<WSMessage>();
  @ViewChild('scroll') private scroll: ElementRef;

  public form: FormGroup = new FormGroup({
    text: new FormControl('', Validators.required)
  });

  private subs: Subscription;

  constructor() {
    console.log(this);
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }

  public submit() {
    const text = this.form.controls.text.value;
    if (this.form.valid && text.replace(/\s/g, '').length) {
      this.message.emit(new WSMessage(this.user.toString(), text))
    }
  }

  private subscribe() {
    this.subs && this.subs.unsubscribe();
    if (this._user) {
      this.subs = this._user.newMessage.subscribe(() => {
        this.scrollToBottom();
      });
    }
  }

  private scrollToBottom(force = false) {
    setTimeout(() => {
      try {
        const element = this.scroll.nativeElement
        if (force || element.scrollTop > element.scrollHeight - element.offsetHeight - 300) {
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) { }
    }, 10);
  }

}