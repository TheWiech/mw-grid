import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-component-header-doc',
    templateUrl: './mw-component-header-doc.component.html',
    styleUrls: ['./mw-component-header-doc.component.scss']
})
export class MwComponentHeaderDocsComponent {
    @Input() componentName: String;
    @Input() selector: String;
    @Input() link: String;
}
