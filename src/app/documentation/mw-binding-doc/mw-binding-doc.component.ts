import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'mw-binding-doc',
    templateUrl: './mw-binding-doc.component.html',
    styleUrls: ['./mw-binding-doc.component.scss']
})
export class MwBindingDocComponent implements AfterViewInit {
    @Input() binding: String;
    @Input() type: String;
    @ViewChild('contentWrapper') projectedContent: ElementRef;

    contentHtml: String;

    constructor() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.contentHtml = this.projectedContent.nativeElement.innerHTML;
        });
    }
}
