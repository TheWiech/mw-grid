import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-banner',
    templateUrl: './mw-banner.component.html',
    styleUrls: ['./mw-banner.component.scss']
})
export class MwBannerComponent {
    @Input() primaryText: String;
    @Input() secondaryText: String;

    constructor() { }
}
