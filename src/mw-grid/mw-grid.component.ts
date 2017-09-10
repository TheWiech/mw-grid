import { Component, OnInit, Input, QueryList, ContentChildren, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({
    selector: 'mw-grid',
    templateUrl: './mw-grid.component.html',
    styleUrls: [
        './mw-grid.component.scss',
        './themes/mw-grid.modern.scss',
        './themes/mw-grid.spreadsheet.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class MwGridComponent implements OnInit {
    @Input() data: Array<any>;
    @Input() bindings: Array<string>;
    @Input() theme: MwGridTheme;
    @ContentChildren(MwColumnDirective) columnDefinitions: QueryList<MwColumnDirective>;

    gridTheme: String;
    gridHeaders: Array<String> = [];

    constructor(private ref: ChangeDetectorRef) { }

    ngOnInit() {
        this.setGridTheme();
    }

    ngAfterViewInit() {
        this.setGridHeaders();
    }

    setGridTheme() {
        switch (this.theme) {
            case MwGridTheme.Modern:
                this.gridTheme = 'modern';
                return;
            case MwGridTheme.Spreadsheet:
                this.gridTheme = 'spreadsheet';
                return;
            default:
                this.gridTheme = 'modern';
        }
    }

    setGridHeaders() {
        this.columnDefinitions.forEach(element => {
            this.gridHeaders.push(element.binding);
        });

        this.ref.detectChanges();
    }

}

export enum MwGridTheme {
    Modern,
    Spreadsheet
}
