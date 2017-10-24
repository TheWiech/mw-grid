import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    QueryList,
    ContentChildren,
    ViewEncapsulation,
    ViewContainerRef,
    ViewChild,
    ElementRef,
    ComponentRef
} from '@angular/core';
import { MwColumnDirective } from '../mw-column/mw-column.directive';
import { MwGridHeader } from '../mw-grid-headers/mw-grid-headers.component';
import { RowFactoryService } from '../row-factory.service';
import { MwRowComponent } from '../mw-row/mw-row.component';
import { MwGridContentHostDirective } from './mw-grid-content-host.directive';

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
export class MwGridComponent implements OnInit, AfterViewInit {
    @Input() data: Array<any>;
    @Input() bindings: Array<string>;
    @Input() theme: MwGridTheme;
    @Input() rowHeight: Number;
    @ContentChildren(MwColumnDirective) columnDefinitions: QueryList<MwColumnDirective>;
    @ViewChild(MwGridContentHostDirective) gridContentHost: MwGridContentHostDirective;
    @ViewChild('gridContainer') gridContainer: ElementRef;

    gridTheme: String;
    gridHeaders: Array<MwGridHeader> = [];
    rows: Array<ComponentRef<MwRowComponent>> = [];

    constructor(private rowFactory: RowFactoryService) {
    }

    ngOnInit() {
        this.setGridTheme();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setGridHeaders();
            this.setColWidths();
            this.createRows();
        });
    }

    createRows() {
        for (let i = 0; i < this.data.length; i++) {
            const currentRow = this.rowFactory.createRow(this.gridContentHost.viewContainerRef, this.columnDefinitions);
            currentRow.instance.item = this.data[i];
            currentRow.instance.rowNumber = i;
            currentRow.instance.height = this.rowHeight;

            this.rows.push(currentRow);
        }
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
            this.gridHeaders.push(new MwGridHeader(element.binding));
        });
    }

    setColWidths() {
        let starSizeTotalWidth = 0;
        const starSizedColumns = new Map<number, MwColumnDirective>();
        const colDefintionArray = this.columnDefinitions.toArray();

        for (let i = 0; i < colDefintionArray.length; i++) {

            // If a column is star sized we must wait until we add up all star sizing properties before we know the width of the column
            if (colDefintionArray[i].isStarSizedWidth()) {
                starSizeTotalWidth += colDefintionArray[i].getStarSizedWidth();
                starSizedColumns.set(i, colDefintionArray[i]);
            } else {
                this.gridHeaders[i].width = colDefintionArray[i].calculatedWidth = `${ colDefintionArray[i].width }px`;
            }

            this.gridHeaders[i].minWidth = colDefintionArray[i].getMinWidth();
            this.gridHeaders[i].maxWidth = colDefintionArray[i].getMaxWidth();
        }

        starSizedColumns.forEach((value, key) => {
            this.gridHeaders[key].width = colDefintionArray[key].calculatedWidth =
                    `${colDefintionArray[key].getStarSizedWidth() / starSizeTotalWidth * 100}%`;
        });
    }

}

export enum MwGridTheme {
    Modern,
    Spreadsheet
}
