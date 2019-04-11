import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  users = [
    { name: 'Petya', last_message: Date.now() },
    { name: 'Vasya', last_message: Date.now() - 1000000 },
  ];
}
