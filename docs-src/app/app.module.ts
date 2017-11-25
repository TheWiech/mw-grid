import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MwGridModule } from '../../src/mw-grid.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { SupportComponent } from './support/support.component';
import { DonateComponent } from './donate/donate.component';
import { HomeComponent } from './home/home.component';
import { DownloadComponent } from './download/download.component';
import { GridExampleComponent } from './grid-example/grid-example.component';
import { MwNavMenuComponent } from './mw-nav-menu/mw-nav-menu.component';
import { MwDropdownNavItemComponent } from './mw-nav-menu/mw-dropdown-nav-item/mw-dropdown-nav-item.component';
import { MwLiveExampleComponent } from './mw-live-example/mw-live-example.component';
import { MwBannerComponent } from './mw-banner/mw-banner.component';
import { MwGridDocsComponent } from './documentation/component-docs/mw-grid-docs/mw-grid-docs.component';
import { MwColumnDocsComponent } from './documentation/component-docs/mw-column-docs/mw-column-docs.component';
import { IntroductionDocsComponent } from './documentation/getting-started-docs/introduction-docs/introduction-docs.component';
import { ThemesDocsComponent } from './documentation/getting-started-docs/themes-docs/themes-docs.component';
import { MwButtonComponent } from './mw-button/mw-button.component';
import { MwBindingDocComponent } from './documentation/mw-binding-doc/mw-binding-doc.component';
import { MwComponentHeaderDocsComponent } from './documentation/mw-component-header-doc/mw-component-header-doc.component';
import { UserIconComponent } from './user-icon/user-icon.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'download', component: DownloadComponent },
    { path: 'documentation/api', component: DocumentationComponent,
        children: [
            { path: 'introduction', component: IntroductionDocsComponent },
            { path: 'themes', component: ThemesDocsComponent },
            { path: 'mw-grid', component: MwGridDocsComponent },
            { path: 'mw-column', component: MwColumnDocsComponent }
        ]
    },
    { path: 'documentation/examples', component: MwLiveExampleComponent },
    { path: 'support', component: SupportComponent },
    { path: 'donate', component: DonateComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        DocumentationComponent,
        SupportComponent,
        DonateComponent,
        HomeComponent,
        DownloadComponent,
        GridExampleComponent,
        MwNavMenuComponent,
        MwDropdownNavItemComponent,
        MwLiveExampleComponent,
        MwBannerComponent,
        MwGridDocsComponent,
        MwColumnDocsComponent,
        IntroductionDocsComponent,
        ThemesDocsComponent,
        MwButtonComponent,
        MwBindingDocComponent,
        MwComponentHeaderDocsComponent,
        UserIconComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        MwGridModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
