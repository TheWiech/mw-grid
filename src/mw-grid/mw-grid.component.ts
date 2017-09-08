import { Component, OnInit, Input, QueryList, ContentChildren } from '@angular/core';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({
    selector: 'mw-grid',
    templateUrl: './mw-grid.component.html',
    styleUrls: ['./mw-grid.component.scss']
})
export class MwGridComponent implements OnInit {
    @Input() data: Array<any>;
    @Input() bindings: Array<string>;
    @ContentChildren(MwColumnDirective) columnDefinitions: QueryList<MwColumnDirective>;

    constructor() { }

    ngOnInit() {
    }

}
