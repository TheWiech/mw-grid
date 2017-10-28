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
    starSizeTotalWidth: number;

    constructor(private rowFactory: RowFactoryService) {
    }

    ngOnInit() {
        this.setGridTheme();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.configureColumnDefinitions();
            this.getStartSizedColumnTotal();
            this.configureRowFactory();
            this.setGridHeaders();
            this.createRows();
        });
    }

    configureRowFactory() {
        this.rowFactory.rowHeight = this.rowHeight;
    }

    createRows() {
        for (let i = 0; i < this.data.length; i++) {
            const currentRow = this.rowFactory.createRow(
                this.gridContentHost.viewContainerRef,
                this,
                this.data[i]);
            currentRow.instance.rowNumber = i;
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

    // TODO: Refactor grid headers to be created through row factory
    setGridHeaders() {
        this.columnDefinitions.forEach(element => {
            const newGridHeader = new MwGridHeader(element.binding);
            newGridHeader.width = element.getWidth();
            newGridHeader.minWidth = element.getMinWidth();
            newGridHeader.maxWidth = element.getMaxWidth();
            this.gridHeaders.push(newGridHeader);
        });
    }

    getStartSizedColumnTotal() {
        this.starSizeTotalWidth = 0;
        const colDefinitions = this.columnDefinitions.toArray();

        for (let i = 0; i < colDefinitions.length; i++) {
            if (colDefinitions[i].isStarSizedWidth()) {
                this.starSizeTotalWidth += colDefinitions[i].getStarSizedWidth();
            }
        }
    }

    configureColumnDefinitions() {
        this.columnDefinitions.forEach(colDefiniton => {
            colDefiniton.grid = this;
        });
    }
}

export enum MwGridTheme {
    Modern,
    Spreadsheet
}
