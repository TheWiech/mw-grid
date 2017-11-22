import { Component, Input, QueryList } from '@angular/core';
import { MwGridComponent } from '../mw-grid/mw-grid.component';

@Component({
    selector: 'mw-row',
    templateUrl: './mw-row.component.html',
    styleUrls: ['./mw-row.component.scss']
})
export class MwRowComponent {
    @Input() item: any;             // The data to display in the row
    @Input() rowNumber: number;     // Index of the row in the grid
    @Input() height: number;        // Height of the row

    grid: MwGridComponent;          // Reference to the instance of the grid this row is in

    constructor() { }
}
