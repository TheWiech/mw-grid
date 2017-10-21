import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-cell',
    templateUrl: './mw-cell.component.html',
    styleUrls: ['./mw-cell.component.scss']
})
export class MwCellComponent {
    @Input() cellText: String;

    constructor() { }
}
