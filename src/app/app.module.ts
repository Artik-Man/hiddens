import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
import { InnerHTMLComponent } from './components/inner-html';

import { ScrollBottomDirective } from './directives/scrollBottom';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InnerHTMLComponent,
    ScrollBottomDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    WebSocketPostService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
