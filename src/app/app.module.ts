import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatButtonModule, MatCheckboxModule, MatToolbarModule,
  MatSidenavModule, MatIconModule, MatListModule,
  MatRadioModule, MatRippleModule, MatInputModule
} from '@angular/material';
// Services
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
// Directives
import { ScrollBottomDirective } from './directives/scrollBottom';
// Components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main';
import { InnerHTMLComponent } from './components/inner-html';
import { ChatComponent } from './components/chat';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InnerHTMLComponent,
    ScrollBottomDirective,
    MainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    // Material
    MatButtonModule,
    MatCheckboxModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatRippleModule,
    MatInputModule
  ],
  providers: [
    WebSocketPostService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
