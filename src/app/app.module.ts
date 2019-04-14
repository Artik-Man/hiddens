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
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
// Services
import { WebSocketPostService } from './services/ws';
import { StateService } from './services/state';
// Pipes
import { OrderByPipe } from './services/pipes/orderBy';
// Directives
import { ScrollBottomDirective } from './directives/scrollBottom';
// Components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main';
import { InnerHTMLComponent } from './components/inner-html';
import { ChatComponent } from './components/chat';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: 'pan-y'
    });
    return mc;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InnerHTMLComponent,
    ScrollBottomDirective,
    MainComponent,
    OrderByPipe
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
    MatInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    WebSocketPostService,
    StateService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
