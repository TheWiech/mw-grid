import { Component, Input, QueryList } from '@angular/core';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({
    selector: 'mw-row',
    templateUrl: './mw-row.component.html',
    styleUrls: ['./mw-row.component.scss']
})
export class MwRowComponent {
    @Input() columnDefinitions: QueryList<MwColumnDirective>;
    @Input() item: any;
    @Input() rowNumber: Number;
    @Input() height: Number;

    constructor() { }
}
