import { Component, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { Message, WSMessage } from 'src/app/models/message';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: 'template.html'
})

export class ChatComponent {
  @Input() user: User;
  @Output() message = new EventEmitter<WSMessage>();
  public form: FormGroup = new FormGroup({
    text: new FormControl('', Validators.required)
  });

  constructor() {
    console.log(this);
  }

  public submit() {
    const text = this.form.controls.text.value;
    if (this.form.valid && text.replace(/\s/g, '').length) {
      this.message.emit(new WSMessage(this.user.toString(), text))
    }
    this.form.controls.text.setValue('');
  }

}
