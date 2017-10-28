import { Directive, OnInit, Input } from '@angular/core';
import { isNumeric } from 'rxjs/util/isNumeric';

import { MwGridComponent } from '../mw-grid/mw-grid.component';

@Directive({
    selector: 'mw-column'
})
export class MwColumnDirective implements OnInit {
    // Key on object that holds the value to be displayed in the grid
    @Input() binding: String;
    @Input() width: String;
    @Input() minWidth: Number;
    @Input() maxWidth: Number;

    private standardWidth: String = '150px';
    public grid: MwGridComponent;

    constructor() {
    }

    ngOnInit() {
        this.validateWidths();
    }

    validateWidths() {
        if (this.width) {
            let parsedWidth: String;

            // Handle star sizing binding.
            if (this.width.search(/\*$/) > -1) {
                parsedWidth = this.width.split('*')[0];
            } else if (this.width.search(/\*/) > -1) {
                throw new Error('star sized width on mw-column must have * at the end');
            } else {
                parsedWidth = this.width;
            }

            this.validateWidthValue(parsedWidth, 'width');
        }

        if (this.minWidth) {
            this.validateWidthValue(this.minWidth, 'minWidth');
        }

        if (this.maxWidth) {
            this.validateWidthValue(this.maxWidth, 'maxWidth');
        }
    }

    validateWidthValue(width: any, inputBinding: String) {
        if (!isNumeric(width)) {
            throw new Error(`${inputBinding} on mw-column must be a number`);
        }

        if (Number(width) < 0) {
            throw new Error(`${inputBinding} on mw-column must be greater than 0`);
        }
    }

    isStarSizedWidth() {
        return this.width !== undefined ? this.width.search(/\*$/) >= 0 : false;
    }

    getStarSizedWidth() {
        return Number(this.width.split('*')[0]);
    }

    getWidth() {
        if (this.width === undefined) {
            return '';
        }

        return this.isStarSizedWidth() === true ? `${this.getStarSizedWidth() / this.grid.starSizeTotalWidth * 100}%` : `${ this.width }`;
    }

    getMinWidth() {
        // When minWidth and width are not set use the maxWidth if it is set otherwise default to
        // the standard width.
        if (this.minWidth === undefined && this.width === undefined) {
            return this.maxWidth !== undefined ? `${ this.maxWidth }px` : this.standardWidth;
        }

        // Returning 0 when minWidth is undefined tells flexbox to allow the content shrink to 0px
        // Without this flexbox will try as hard as it can to keep the entire content in the column visible
        return this.minWidth !== undefined ? `${ this.minWidth }px` : '0';
    }

    getMaxWidth() {
        // When maxWidth and width are not set use the minWidth if it is set otherwise default to
        // the standard width.
        if (this.maxWidth === undefined && this.width === undefined) {
            return this.minWidth !== undefined ? `${ this.minWidth }px` : this.standardWidth;
        }

        return this.maxWidth !== undefined ? `${ this.maxWidth }px` : '';
    }
}
