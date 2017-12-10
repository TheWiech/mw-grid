import { Component, ElementRef, Input, Output, OnInit, OnChanges, DoCheck, SimpleChange, EventEmitter, ViewChild } from '@angular/core';

const NUM_OF_PAGES_FOR_SMALL_CONTAINER = 4;
const NUM_OF_PAGES_FOR_LARGE_CONTAINER = 6;

@Component({
    selector: 'mw-pagination-control',
    templateUrl: './mw-pagination-control.component.html',
    styleUrls: ['./mw-pagination-control.component.scss']
})
export class MwPaginationControlComponent implements OnInit, OnChanges, DoCheck {
    @Input() totalItems: number;
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalPages: number;

    @Output() goToPage: EventEmitter<number> = new EventEmitter();

    @ViewChild('paginationContainer') paginationContainer: ElementRef;

    selectablePages: Array<number> = []; // Array of page numbers that a user can select
    displayItemsOverview = true;

    private numberOfSelectablePages = 6;

    constructor() {}

    ngOnInit() {
        this.initSelectablePages();
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes.currentPage) {
            this.updateSelectablePages();
        }
    }

    ngDoCheck() {
        if (this.isSmallContainer() && this.numberOfSelectablePages === NUM_OF_PAGES_FOR_LARGE_CONTAINER) {
            this.numberOfSelectablePages = NUM_OF_PAGES_FOR_SMALL_CONTAINER;
            this.initSelectablePages();
        } else if (!this.isSmallContainer() && this.numberOfSelectablePages === NUM_OF_PAGES_FOR_SMALL_CONTAINER) {
            this.numberOfSelectablePages = NUM_OF_PAGES_FOR_LARGE_CONTAINER;
            this.initSelectablePages();
        }
    }

    isSmallContainer() {
        return this.paginationContainer.nativeElement.offsetWidth < 800; // 800 because thats the number I chose
    }

    goToPageClick(pageNumber) {
        this.goToPage.emit(pageNumber);
    }

    private initSelectablePages() {
        this.selectablePages = [];
        this.addSelectablePagesAfterCurrentPage();

        if (this.selectablePages.length < this.numberOfSelectablePages) {
            this.addSelectablePagesBeforeCurrentPage();
        }
    }

    private addSelectablePagesAfterCurrentPage() {
        let currentPageNumber = this.currentPage;

        for (let i = 0; i < this.numberOfSelectablePages; i++) {
            if (currentPageNumber <= this.totalPages) {
                this.selectablePages.push(currentPageNumber);
                currentPageNumber++;
            } else {
                break;
            }
        }
    }

    private addSelectablePagesBeforeCurrentPage() {
        let currentPageNumber = this.currentPage - 1;

        const numOfSelectablePages = this.selectablePages.length;
        for (let i = 0; i < this.numberOfSelectablePages - numOfSelectablePages; i++) {
            if (currentPageNumber >= 1) {
                this.selectablePages.unshift(currentPageNumber);
                currentPageNumber--;
            } else {
                break;
            }
        }
    }

    private updateSelectablePages() {
        if (this.isLastSelectablePage(this.currentPage)) {
            this.selectablePages.shift();
            this.selectablePages.push(this.currentPage + 1);
        } else if (this.isFirstSelectablePage(this.currentPage)) {
            this.selectablePages.pop();
            this.selectablePages.unshift(this.currentPage - 1);
        }
    }

    private isLastSelectablePage(pageNumber) {
        return pageNumber >= this.selectablePages[this.selectablePages.length - 1] &&
            pageNumber < this.totalPages;
    }

    private isFirstSelectablePage(pageNumber) {
        return pageNumber <= this.selectablePages[0] && pageNumber > 1;
    }
}
