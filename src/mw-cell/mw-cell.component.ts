import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { MwRowComponent } from '../mw-row/mw-row.component';

@Component({
    selector: 'mw-cell',
    templateUrl: './mw-cell.component.html',
    styleUrls: ['./mw-cell.component.scss']
})
export class MwCellComponent implements OnInit {
    @Input() item: any;
    @Input() binding: string;
    @Input() template: TemplateRef<any>;
    @Input() row: MwRowComponent;
    @Input() cellClass: string;

    cellContext = {};

    constructor() { }

    ngOnInit() {
        this.cellContext['$implicit'] = this.item;
        this.cellContext['rowNumber'] = this.row.rowNumber;
    }
}
