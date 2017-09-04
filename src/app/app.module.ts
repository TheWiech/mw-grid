import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MwGridComponent } from '../mw-grid/mw-grid.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { SupportComponent } from './support/support.component';
import { DonateComponent } from './donate/donate.component';
import { HomeComponent } from './home/home.component';
import { DownloadComponent } from './download/download.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: 'support', component: SupportComponent },
  { path: 'donate', component: DonateComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MwGridComponent,
    PageNotFoundComponent,
    DocumentationComponent,
    SupportComponent,
    DonateComponent,
    HomeComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
