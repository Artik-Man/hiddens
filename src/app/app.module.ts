import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // Material
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [
    WebSocketPostService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
