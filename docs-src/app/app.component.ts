import { Component } from '@angular/core';

@Component({
    selector: 'mw-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    shouldShowConstructionBanner = true;

    constructor() { }
}
