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
    ComponentRef,
    ChangeDetectorRef
} from '@angular/core';
import { MwColumnDirective } from '../mw-column/mw-column.directive';
import { MwGridHeader } from '../mw-grid-headers/mw-grid-headers.component';
import { RowFactoryService } from '../row-factory.service';
import { MwRowComponent } from '../mw-row/mw-row.component';
import { MwGridContentHostDirective } from './mw-grid-content-host.directive';

// https://github.com/Microsoft/TypeScript/issues/9548
interface WhatWGEventListenerArgs {
    capture?: boolean;
}

interface WhatWGAddEventListenerArgs extends WhatWGEventListenerArgs {
    passive?: boolean;
    once?: boolean;
}

type WhatWGAddEventListener = (
    type: string,
    listener: (event: Event) => void,
    options?: WhatWGAddEventListenerArgs
) => void;

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
    @Input() rowHeight: number;

    @ContentChildren(MwColumnDirective) columnDefinitions: QueryList<MwColumnDirective>;
    @ViewChild('gridContainer') gridContainer: ElementRef;
    @ViewChild('gridContent') gridContent: ElementRef;
    @ViewChild(MwGridContentHostDirective) gridContentHost: MwGridContentHostDirective;  // Anchor element for row container

    gridTheme: String;
    gridHeaders: Array<MwGridHeader> = [];
    starSizeTotalWidth: number;

    private rows: Array<ComponentRef<MwRowComponent>> = [];
    private numberOfVisibleRows: number;
    private lastScrollPosition = 0;

    constructor(private rowFactory: RowFactoryService, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        this.setGridTheme();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.configureColumnDefinitions();
            this.getStarSizedColumnTotal();
            this.configureRowFactory();
            this.setGridHeight();
            this.setGridHeaders();
            this.initializeRows();
            this.addScrollListener();
        });
    }

    // TODO: Allow user to set a custom theme
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
    private setGridHeaders() {
        this.columnDefinitions.forEach(element => {
            const newGridHeader = new MwGridHeader(element.binding);
            newGridHeader.width = element.getWidth();
            newGridHeader.minWidth = element.getMinWidth();
            newGridHeader.maxWidth = element.getMaxWidth();
            this.gridHeaders.push(newGridHeader);
        });
    }

    private getStarSizedColumnTotal() {
        this.starSizeTotalWidth = 0;
        const colDefinitions = this.columnDefinitions.toArray();

        for (let i = 0; i < colDefinitions.length; i++) {
            if (colDefinitions[i].isStarSizedWidth()) {
                this.starSizeTotalWidth += colDefinitions[i].getStarSizedWidth();
            }
        }
    }

    private configureColumnDefinitions() {
        this.columnDefinitions.forEach(colDefiniton => {
            colDefiniton.grid = this;
        });
    }

    /**
     * Attach scroll listener to the grid container. This cannot be done through angular scroll binding
     * because angular binding does not support the passive parameter.
     */
    private addScrollListener() {
        const nativeGridElement = window.document.querySelector('.mw-grid-container');
        // https://github.com/Microsoft/TypeScript/issues/9548
        (nativeGridElement.addEventListener as WhatWGAddEventListener)('scroll', this.onGridScroll.bind(this), { passive: true, });
    }

    onGridScroll($event) {
        if (this.hasScrolledDown($event.target.scrollTop) && this.shouldAddRows(false, $event.target)) {
            const prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;
            // Do not need to account for headerHeight because it is included in scroll top
            const currentScrollPosition = $event.target.scrollTop + $event.target.offsetHeight;
            const desiredBottomRowPos = currentScrollPosition + prefetchedRowsHeight;

            const bottomRowNumber = this.rows[this.rows.length - 1].instance.rowNumber + 1;
            const currentBottomRowPos = bottomRowNumber * this.rowHeight + this.headerHeight();

            const rowsToCreate = Math.ceil((desiredBottomRowPos - currentBottomRowPos) / this.rowHeight);
            this.addRowsOnBottom(rowsToCreate, $event.target.scrollTop);
        } else if (this.shouldAddRows(true, $event.target)) {
            const prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;
            const currentScrollPosition = $event.target.scrollTop;
            const desiredTopRowPos = currentScrollPosition - prefetchedRowsHeight;

            const topRowNumber = this.rows[0].instance.rowNumber;
            const currentTopRowPos = topRowNumber * this.rowHeight + this.headerHeight();

            const rowsToCreate = Math.ceil((currentTopRowPos - desiredTopRowPos) / this.rowHeight);
            this.addRowsOnTop(rowsToCreate, $event.target.scrollTop);
        }

        this.lastScrollPosition = $event.target.scrollTop;
    }

    private configureRowFactory() {
        this.rowFactory.rowHeight = this.rowHeight;
    }

    private initializeRows() {
        const gridHeight = this.gridContainer.nativeElement.offsetHeight;
        this.numberOfVisibleRows = Math.ceil( (gridHeight - this.headerHeight()) / this.rowHeight);
        const rowsNeeded = Math.ceil(this.numberOfVisibleRows * 2.5);

        for (let i = 0; i < rowsNeeded; i++) {
            this.addNewRow(i, false);
        }
    }

    private setGridHeight() {
        this.gridContent.nativeElement.style.height = `${ this.rowHeight * this.data.length + this.headerHeight() }px`;
    }

    private positionGridRow(row: ComponentRef<MwRowComponent>, index: number) {
        row.location.nativeElement.style.top = `${ (index * this.rowHeight) + this.headerHeight() }px`;
    }

    private addRowsOnBottom(numOfRowsToCreate: number, scrollTop: number) {
        const bottomRowNumber = this.rows[this.rows.length - 1].instance.rowNumber;
        let newRowNumber = bottomRowNumber;
        while (numOfRowsToCreate > 0) {
            newRowNumber++;
            if (newRowNumber >= this.data.length) {
                break;
            }

            this.addNewRow(newRowNumber, false);

            // If the row that we are about to remove is in the prefetched range do not remove it.
            if (this.rows[0].instance.rowNumber * this.rowHeight + this.headerHeight() <
                    scrollTop - (this.numberOfVisibleRows * this.rowHeight)) {
                this.removeRow(true);
            }

            numOfRowsToCreate--;
        }
    }

    private addRowsOnTop(numOfRowsToCreate: number, scrollTop: number) {
        const topRowNumber = this.rows[0].instance.rowNumber;
        let newRowNumber = topRowNumber;
        while (numOfRowsToCreate > 0) {
            newRowNumber--;
            if (newRowNumber < 0) {
                break;
            }

            this.addNewRow(newRowNumber, true);

            // If the row that we are about to remove is in the prefetched range do not remove it.
            if ((this.rows[this.rows.length - 1].instance.rowNumber + 1) * this.rowHeight >
                    scrollTop + ((this.numberOfVisibleRows * 2) * this.rowHeight)) {
                this.removeRow(false);
            } else {
            }

            numOfRowsToCreate--;
        }
    }

    private removeRow(shouldRemoveTopRow: boolean) {
        const rowToRemove = shouldRemoveTopRow === true ? this.rows.shift() : this.rows.pop();
        rowToRemove.destroy();
    }

    private addNewRow(rowNumber: number, addToTop: boolean) {
        const newRow = this.rowFactory.createRow(this.gridContentHost.viewContainerRef,
            this,
            this.data[rowNumber]);
            newRow.instance.rowNumber = rowNumber;
        this.positionGridRow(newRow, rowNumber);
        addToTop === true ? this.rows.unshift(newRow) : this.rows.push(newRow);
    }

    private hasScrolledDown(scrollPosition): boolean {
        return this.lastScrollPosition < scrollPosition;
    }

    private numOfRowsToPrefetch(): number {
        return this.numberOfVisibleRows;
    }

    private headerHeight(): number {
        return 25;
    }

    private shouldAddRows(topOfGrid: boolean, currentGridState: any) {
        const prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;

        let rowNumber: number;              // Index of the top or bottom most loaded row
        let currentScrollPosition: number;  // Scroll top when topOfGrid is true, otherwise scrollTop + offsetHeight
        let desiredRowPos: number;          // Position that top or bottom most loaded row should be.

        if (topOfGrid === true) {
            rowNumber = this.rows[0].instance.rowNumber;
            // Add headerHeight to ensure rows are loaded on the top only when the top of a row goes off the bottom of the screen
            currentScrollPosition = currentGridState.scrollTop + this.headerHeight();
            desiredRowPos = currentScrollPosition - prefetchedRowsHeight;
        } else {
            rowNumber = this.rows[this.rows.length - 1].instance.rowNumber + 1;
            // Subract header height to ensure rows are loaded on the bottom only when the bottom of a row goes off the top of the screen.
            // If headerHeight was not accounted for rows on the bottom would be loaded prematurely.
            currentScrollPosition = currentGridState.scrollTop + currentGridState.offsetHeight - this.headerHeight();
            desiredRowPos = currentScrollPosition + prefetchedRowsHeight;
        }

        if (rowNumber === 0 || rowNumber === this.data.length) {
            return false;
        }

        const currentRowPos = rowNumber * this.rowHeight + this.headerHeight();

        // If desiredRowPos < currentRowPos when topOfGrid is true we know we do not have enough rows prefetched
        // on the top of the grid. Vice Versa for the bottom of the grid.
        return topOfGrid === true ?  desiredRowPos < currentRowPos : desiredRowPos > currentRowPos;
    }
}

export enum MwGridTheme {
    Modern,
    Spreadsheet
}
