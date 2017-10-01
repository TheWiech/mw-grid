import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'mw-banner',
    templateUrl: './mw-banner.component.html',
    styleUrls: ['./mw-banner.component.scss']
})
export class MwBannerComponent implements OnInit {
    @Input() primaryText: String;
    @Input() secondaryText: String;
    @Input() applyMargin: boolean;

    bannerMargin: String;

    constructor() { }

    ngOnInit() {
        this.setBannerMargin();
    }

    ngOnChanges() {
        this.setBannerMargin();
    }

    setBannerMargin() {
        this.bannerMargin = this.applyMargin === false ? '0' : '2.5em';
    }
}
