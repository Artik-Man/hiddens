import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {LayoutModule} from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {WebSocketPostService} from './services/ws';
import {StateService} from './services/state';
import {OrderByPipe} from './services/pipes/orderBy';
import {ScrollBottomDirective} from './directives/scrollBottom';
import {AppComponent} from './app.component';
import {MainComponent} from './components/main';
import {InnerHTMLComponent} from './components/inner-html';
import {ChatComponent} from './components/chat';

declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: 'pan-y'
    });
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
    // ServiceWorker
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
