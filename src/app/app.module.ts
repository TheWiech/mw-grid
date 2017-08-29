import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MwGridComponent } from '../mw-grid/mw-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    MwGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
