import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WebSocketPostService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
