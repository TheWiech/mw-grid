webpackJsonp([0],Array(96).concat([
/* 96 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 96;

/***/ }),
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwGridComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MwGridTheme; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mw_column_mw_column_directive__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mw_grid_headers_mw_grid_headers_component__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__row_factory_service__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mw_grid_content_host_directive__ = __webpack_require__(105);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MwGridComponent = (function () {
    function MwGridComponent(rowFactory, ref) {
        this.rowFactory = rowFactory;
        this.ref = ref;
        this.gridHeaders = [];
        this.rows = [];
        this.lastScrollPosition = 0;
    }
    MwGridComponent.prototype.ngOnInit = function () {
        this.setGridTheme();
    };
    MwGridComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.configureColumnDefinitions();
            _this.getStarSizedColumnTotal();
            _this.configureRowFactory();
            _this.setGridHeight();
            _this.setGridHeaders();
            _this.initializeRows();
            _this.addScrollListener();
        });
    };
    // TODO: Allow user to set a custom theme
    MwGridComponent.prototype.setGridTheme = function () {
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
    };
    // TODO: Refactor grid headers to be created through row factory
    MwGridComponent.prototype.setGridHeaders = function () {
        var _this = this;
        this.columnDefinitions.forEach(function (element) {
            var newGridHeader = new __WEBPACK_IMPORTED_MODULE_2__mw_grid_headers_mw_grid_headers_component__["a" /* MwGridHeader */](element.binding);
            newGridHeader.width = element.getWidth();
            newGridHeader.minWidth = element.getMinWidth();
            newGridHeader.maxWidth = element.getMaxWidth();
            _this.gridHeaders.push(newGridHeader);
        });
    };
    MwGridComponent.prototype.getStarSizedColumnTotal = function () {
        this.starSizeTotalWidth = 0;
        var colDefinitions = this.columnDefinitions.toArray();
        for (var i = 0; i < colDefinitions.length; i++) {
            if (colDefinitions[i].isStarSizedWidth()) {
                this.starSizeTotalWidth += colDefinitions[i].getStarSizedWidth();
            }
        }
    };
    MwGridComponent.prototype.configureColumnDefinitions = function () {
        var _this = this;
        this.columnDefinitions.forEach(function (colDefiniton) {
            colDefiniton.grid = _this;
        });
    };
    /**
     * Attach scroll listener to the grid container. This cannot be done through angular scroll binding
     * because angular binding does not support the passive parameter.
     */
    MwGridComponent.prototype.addScrollListener = function () {
        var nativeGridElement = window.document.querySelector('.mw-grid-container');
        // https://github.com/Microsoft/TypeScript/issues/9548
        nativeGridElement.addEventListener('scroll', this.onGridScroll.bind(this), { passive: true, });
    };
    MwGridComponent.prototype.onGridScroll = function ($event) {
        if (this.hasScrolledDown($event.target.scrollTop) && this.shouldAddRows(false, $event.target)) {
            var prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;
            // Do not need to account for headerHeight because it is included in scroll top
            var currentScrollPosition = $event.target.scrollTop + $event.target.offsetHeight;
            var desiredBottomRowPos = currentScrollPosition + prefetchedRowsHeight;
            var bottomRowNumber = this.rows[this.rows.length - 1].instance.rowNumber + 1;
            var currentBottomRowPos = bottomRowNumber * this.rowHeight + this.headerHeight();
            var rowsToCreate = Math.ceil((desiredBottomRowPos - currentBottomRowPos) / this.rowHeight);
            this.addRowsOnBottom(rowsToCreate, $event.target.scrollTop);
        }
        else if (this.shouldAddRows(true, $event.target)) {
            var prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;
            var currentScrollPosition = $event.target.scrollTop;
            var desiredTopRowPos = currentScrollPosition - prefetchedRowsHeight;
            var topRowNumber = this.rows[0].instance.rowNumber;
            var currentTopRowPos = topRowNumber * this.rowHeight + this.headerHeight();
            var rowsToCreate = Math.ceil((currentTopRowPos - desiredTopRowPos) / this.rowHeight);
            this.addRowsOnTop(rowsToCreate, $event.target.scrollTop);
        }
        this.lastScrollPosition = $event.target.scrollTop;
    };
    MwGridComponent.prototype.configureRowFactory = function () {
        this.rowFactory.rowHeight = this.rowHeight;
    };
    MwGridComponent.prototype.initializeRows = function () {
        var gridHeight = this.gridContainer.nativeElement.offsetHeight;
        this.numberOfVisibleRows = Math.ceil((gridHeight - this.headerHeight()) / this.rowHeight);
        var rowsNeeded = Math.ceil(this.numberOfVisibleRows * 2.5);
        for (var i = 0; i < rowsNeeded; i++) {
            this.addNewRow(i, false);
        }
    };
    MwGridComponent.prototype.setGridHeight = function () {
        this.gridContent.nativeElement.style.height = this.rowHeight * this.data.length + this.headerHeight() + "px";
    };
    MwGridComponent.prototype.positionGridRow = function (row, index) {
        row.location.nativeElement.style.top = (index * this.rowHeight) + this.headerHeight() + "px";
    };
    MwGridComponent.prototype.addRowsOnBottom = function (numOfRowsToCreate, scrollTop) {
        var bottomRowNumber = this.rows[this.rows.length - 1].instance.rowNumber;
        var newRowNumber = bottomRowNumber;
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
    };
    MwGridComponent.prototype.addRowsOnTop = function (numOfRowsToCreate, scrollTop) {
        var topRowNumber = this.rows[0].instance.rowNumber;
        var newRowNumber = topRowNumber;
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
            }
            else {
            }
            numOfRowsToCreate--;
        }
    };
    MwGridComponent.prototype.removeRow = function (shouldRemoveTopRow) {
        var rowToRemove = shouldRemoveTopRow === true ? this.rows.shift() : this.rows.pop();
        rowToRemove.destroy();
    };
    MwGridComponent.prototype.addNewRow = function (rowNumber, addToTop) {
        var newRow = this.rowFactory.createRow(this.gridContentHost.viewContainerRef, this, this.data[rowNumber]);
        newRow.instance.rowNumber = rowNumber;
        this.positionGridRow(newRow, rowNumber);
        addToTop === true ? this.rows.unshift(newRow) : this.rows.push(newRow);
    };
    MwGridComponent.prototype.hasScrolledDown = function (scrollPosition) {
        return this.lastScrollPosition < scrollPosition;
    };
    MwGridComponent.prototype.numOfRowsToPrefetch = function () {
        return this.numberOfVisibleRows;
    };
    MwGridComponent.prototype.headerHeight = function () {
        return 25;
    };
    MwGridComponent.prototype.shouldAddRows = function (topOfGrid, currentGridState) {
        var prefetchedRowsHeight = this.numOfRowsToPrefetch() * this.rowHeight;
        var rowNumber; // Index of the top or bottom most loaded row
        var currentScrollPosition; // Scroll top when topOfGrid is true, otherwise scrollTop + offsetHeight
        var desiredRowPos; // Position that top or bottom most loaded row should be.
        if (topOfGrid === true) {
            rowNumber = this.rows[0].instance.rowNumber;
            // Add headerHeight to ensure rows are loaded on the top only when the top of a row goes off the bottom of the screen
            currentScrollPosition = currentGridState.scrollTop + this.headerHeight();
            desiredRowPos = currentScrollPosition - prefetchedRowsHeight;
        }
        else {
            rowNumber = this.rows[this.rows.length - 1].instance.rowNumber + 1;
            // Subract header height to ensure rows are loaded on the bottom only when the bottom of a row goes off the top of the screen.
            // If headerHeight was not accounted for rows on the bottom would be loaded prematurely.
            currentScrollPosition = currentGridState.scrollTop + currentGridState.offsetHeight - this.headerHeight();
            desiredRowPos = currentScrollPosition + prefetchedRowsHeight;
        }
        if (rowNumber === 0 || rowNumber === this.data.length) {
            return false;
        }
        var currentRowPos = rowNumber * this.rowHeight + this.headerHeight();
        // If desiredRowPos < currentRowPos when topOfGrid is true we know we do not have enough rows prefetched
        // on the top of the grid. Vice Versa for the bottom of the grid.
        return topOfGrid === true ? desiredRowPos < currentRowPos : desiredRowPos > currentRowPos;
    };
    return MwGridComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwGridComponent.prototype, "data", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwGridComponent.prototype, "bindings", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], MwGridComponent.prototype, "theme", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], MwGridComponent.prototype, "rowHeight", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ContentChildren */])(__WEBPACK_IMPORTED_MODULE_1__mw_column_mw_column_directive__["a" /* MwColumnDirective */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */]) === "function" && _a || Object)
], MwGridComponent.prototype, "columnDefinitions", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('gridContainer'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */]) === "function" && _b || Object)
], MwGridComponent.prototype, "gridContainer", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('gridContent'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */]) === "function" && _c || Object)
], MwGridComponent.prototype, "gridContent", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4__mw_grid_content_host_directive__["a" /* MwGridContentHostDirective */]),
    __metadata("design:type", typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__mw_grid_content_host_directive__["a" /* MwGridContentHostDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__mw_grid_content_host_directive__["a" /* MwGridContentHostDirective */]) === "function" && _d || Object)
], MwGridComponent.prototype, "gridContentHost", void 0);
MwGridComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-grid',
        template: __webpack_require__(182),
        styles: [__webpack_require__(183), __webpack_require__(184), __webpack_require__(185)],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None
    }),
    __metadata("design:paramtypes", [typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3__row_factory_service__["a" /* RowFactoryService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__row_factory_service__["a" /* RowFactoryService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* ChangeDetectorRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* ChangeDetectorRef */]) === "function" && _f || Object])
], MwGridComponent);

var MwGridTheme;
(function (MwGridTheme) {
    MwGridTheme[MwGridTheme["Modern"] = 0] = "Modern";
    MwGridTheme[MwGridTheme["Spreadsheet"] = 1] = "Spreadsheet";
})(MwGridTheme || (MwGridTheme = {}));
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=mw-grid.component.js.map

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwColumnDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_util_isNumeric__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_util_isNumeric___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_util_isNumeric__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MwColumnDirective = (function () {
    function MwColumnDirective() {
        this.standardWidth = '150px';
    }
    MwColumnDirective.prototype.ngOnInit = function () {
        this.validateWidths();
    };
    MwColumnDirective.prototype.validateWidths = function () {
        if (this.width) {
            var parsedWidth = void 0;
            // Handle star sizing binding.
            if (this.width.search(/\*$/) > -1) {
                parsedWidth = this.width.split('*')[0];
            }
            else if (this.width.search(/\*/) > -1) {
                throw new Error('star sized width on mw-column must have * at the end');
            }
            else {
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
    };
    MwColumnDirective.prototype.validateWidthValue = function (width, inputBinding) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_1_rxjs_util_isNumeric__["isNumeric"])(width)) {
            throw new Error(inputBinding + " on mw-column must be a number");
        }
        if (Number(width) < 0) {
            throw new Error(inputBinding + " on mw-column must be greater than 0");
        }
    };
    MwColumnDirective.prototype.isStarSizedWidth = function () {
        return this.width !== undefined ? this.width.search(/\*$/) >= 0 : false;
    };
    MwColumnDirective.prototype.getStarSizedWidth = function () {
        return Number(this.width.split('*')[0]);
    };
    MwColumnDirective.prototype.getWidth = function () {
        if (this.width === undefined) {
            return '';
        }
        return this.isStarSizedWidth() === true ? this.getStarSizedWidth() / this.grid.starSizeTotalWidth * 100 + "%" : "" + this.width;
    };
    MwColumnDirective.prototype.getMinWidth = function () {
        // When minWidth and width are not set use the maxWidth if it is set otherwise default to
        // the standard width.
        if (this.minWidth === undefined && this.width === undefined) {
            return this.maxWidth !== undefined ? this.maxWidth + "px" : this.standardWidth;
        }
        // Returning 0 when minWidth is undefined tells flexbox to allow the content shrink to 0px
        // Without this flexbox will try as hard as it can to keep the entire content in the column visible
        return this.minWidth !== undefined ? this.minWidth + "px" : '0';
    };
    MwColumnDirective.prototype.getMaxWidth = function () {
        // When maxWidth and width are not set use the minWidth if it is set otherwise default to
        // the standard width.
        if (this.maxWidth === undefined && this.width === undefined) {
            return this.minWidth !== undefined ? this.minWidth + "px" : this.standardWidth;
        }
        return this.maxWidth !== undefined ? this.maxWidth + "px" : '';
    };
    return MwColumnDirective;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwColumnDirective.prototype, "binding", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwColumnDirective.prototype, "width", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwColumnDirective.prototype, "minWidth", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwColumnDirective.prototype, "maxWidth", void 0);
MwColumnDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({
        selector: 'mw-column'
    }),
    __metadata("design:paramtypes", [])
], MwColumnDirective);

//# sourceMappingURL=mw-column.directive.js.map

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MwGridHeadersComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwGridHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwGridHeadersComponent = (function () {
    function MwGridHeadersComponent() {
    }
    MwGridHeadersComponent.prototype.ngOnInit = function () {
    };
    return MwGridHeadersComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwGridHeadersComponent.prototype, "headers", void 0);
MwGridHeadersComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-grid-headers',
        template: __webpack_require__(178),
        styles: [__webpack_require__(179)]
    }),
    __metadata("design:paramtypes", [])
], MwGridHeadersComponent);

var MwGridHeader = (function () {
    function MwGridHeader(title) {
        this.title = title;
    }
    return MwGridHeader;
}());

//# sourceMappingURL=mw-grid-headers.component.js.map

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RowFactoryService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mw_row_mw_row_component__ = __webpack_require__(104);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var RowFactoryService = (function () {
    function RowFactoryService(resolver) {
        this.resolver = resolver;
        this.rowHeight = 55;
    }
    RowFactoryService.prototype.createRow = function (viewRef, grid, item) {
        var componentFactory = this.resolver.resolveComponentFactory(__WEBPACK_IMPORTED_MODULE_1__mw_row_mw_row_component__["a" /* MwRowComponent */]);
        var row = viewRef.createComponent(componentFactory);
        row.instance.height = this.rowHeight;
        row.instance.item = item;
        row.instance.grid = grid;
        row.location.nativeElement.style.position = 'absolute';
        row.location.nativeElement.style.width = '100%';
        return row;
    };
    return RowFactoryService;
}());
RowFactoryService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* ComponentFactoryResolver */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* ComponentFactoryResolver */]) === "function" && _a || Object])
], RowFactoryService);

var _a;
//# sourceMappingURL=row-factory.service.js.map

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwRowComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwRowComponent = (function () {
    function MwRowComponent() {
    }
    return MwRowComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwRowComponent.prototype, "item", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], MwRowComponent.prototype, "rowNumber", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], MwRowComponent.prototype, "height", void 0);
MwRowComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-row',
        template: __webpack_require__(180),
        styles: [__webpack_require__(181)]
    }),
    __metadata("design:paramtypes", [])
], MwRowComponent);

//# sourceMappingURL=mw-row.component.js.map

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwGridContentHostDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwGridContentHostDirective = (function () {
    /**
     * This directive exposes viewContainerRef so it can act as an anchor directive.
     */
    function MwGridContentHostDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    return MwGridContentHostDirective;
}());
MwGridContentHostDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({
        selector: '[mw-grid-content-host]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["_18" /* ViewContainerRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["_18" /* ViewContainerRef */]) === "function" && _a || Object])
], MwGridContentHostDirective);

var _a;
//# sourceMappingURL=mw-grid-content-host.directive.js.map

/***/ }),
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(144);
module.exports = __webpack_require__(251);


/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bootstrap__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_bootstrap__);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_23" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_mw_grid_module__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__page_not_found_page_not_found_component__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__documentation_documentation_component__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__support_support_component__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__donate_donate_component__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__home_home_component__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__download_download_component__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__grid_example_grid_example_component__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__mw_nav_menu_mw_nav_menu_component__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__mw_nav_menu_mw_dropdown_nav_item_mw_dropdown_nav_item_component__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__mw_live_example_mw_live_example_component__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__mw_banner_mw_banner_component__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__documentation_component_docs_mw_grid_docs_mw_grid_docs_component__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__documentation_component_docs_mw_column_docs_mw_column_docs_component__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__documentation_getting_started_docs_introduction_docs_introduction_docs_component__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__documentation_getting_started_docs_themes_docs_themes_docs_component__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__mw_button_mw_button_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__documentation_mw_binding_doc_mw_binding_doc_component__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__documentation_mw_component_header_doc_mw_component_header_doc_component__ = __webpack_require__(244);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























var appRoutes = [
    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_9__home_home_component__["a" /* HomeComponent */] },
    { path: 'download', component: __WEBPACK_IMPORTED_MODULE_10__download_download_component__["a" /* DownloadComponent */] },
    { path: 'documentation/api', component: __WEBPACK_IMPORTED_MODULE_6__documentation_documentation_component__["a" /* DocumentationComponent */],
        children: [
            { path: 'introduction', component: __WEBPACK_IMPORTED_MODULE_18__documentation_getting_started_docs_introduction_docs_introduction_docs_component__["a" /* IntroductionDocsComponent */] },
            { path: 'themes', component: __WEBPACK_IMPORTED_MODULE_19__documentation_getting_started_docs_themes_docs_themes_docs_component__["a" /* ThemesDocsComponent */] },
            { path: 'mw-grid', component: __WEBPACK_IMPORTED_MODULE_16__documentation_component_docs_mw_grid_docs_mw_grid_docs_component__["a" /* MwGridDocsComponent */] },
            { path: 'mw-column', component: __WEBPACK_IMPORTED_MODULE_17__documentation_component_docs_mw_column_docs_mw_column_docs_component__["a" /* MwColumnDocsComponent */] }
        ]
    },
    { path: 'documentation/examples', component: __WEBPACK_IMPORTED_MODULE_14__mw_live_example_mw_live_example_component__["a" /* MwLiveExampleComponent */] },
    { path: 'support', component: __WEBPACK_IMPORTED_MODULE_7__support_support_component__["a" /* SupportComponent */] },
    { path: 'donate', component: __WEBPACK_IMPORTED_MODULE_8__donate_donate_component__["a" /* DonateComponent */] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_5__page_not_found_page_not_found_component__["a" /* PageNotFoundComponent */] }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["M" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__page_not_found_page_not_found_component__["a" /* PageNotFoundComponent */],
            __WEBPACK_IMPORTED_MODULE_6__documentation_documentation_component__["a" /* DocumentationComponent */],
            __WEBPACK_IMPORTED_MODULE_7__support_support_component__["a" /* SupportComponent */],
            __WEBPACK_IMPORTED_MODULE_8__donate_donate_component__["a" /* DonateComponent */],
            __WEBPACK_IMPORTED_MODULE_9__home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_10__download_download_component__["a" /* DownloadComponent */],
            __WEBPACK_IMPORTED_MODULE_11__grid_example_grid_example_component__["a" /* GridExampleComponent */],
            __WEBPACK_IMPORTED_MODULE_12__mw_nav_menu_mw_nav_menu_component__["a" /* MwNavMenuComponent */],
            __WEBPACK_IMPORTED_MODULE_13__mw_nav_menu_mw_dropdown_nav_item_mw_dropdown_nav_item_component__["a" /* MwDropdownNavItemComponent */],
            __WEBPACK_IMPORTED_MODULE_14__mw_live_example_mw_live_example_component__["a" /* MwLiveExampleComponent */],
            __WEBPACK_IMPORTED_MODULE_15__mw_banner_mw_banner_component__["a" /* MwBannerComponent */],
            __WEBPACK_IMPORTED_MODULE_16__documentation_component_docs_mw_grid_docs_mw_grid_docs_component__["a" /* MwGridDocsComponent */],
            __WEBPACK_IMPORTED_MODULE_17__documentation_component_docs_mw_column_docs_mw_column_docs_component__["a" /* MwColumnDocsComponent */],
            __WEBPACK_IMPORTED_MODULE_18__documentation_getting_started_docs_introduction_docs_introduction_docs_component__["a" /* IntroductionDocsComponent */],
            __WEBPACK_IMPORTED_MODULE_19__documentation_getting_started_docs_themes_docs_themes_docs_component__["a" /* ThemesDocsComponent */],
            __WEBPACK_IMPORTED_MODULE_20__mw_button_mw_button_component__["a" /* MwButtonComponent */],
            __WEBPACK_IMPORTED_MODULE_21__documentation_mw_binding_doc_mw_binding_doc_component__["a" /* MwBindingDocComponent */],
            __WEBPACK_IMPORTED_MODULE_22__documentation_mw_component_header_doc_mw_component_header_doc_component__["a" /* MwComponentHeaderDocsComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* RouterModule */].forRoot(appRoutes),
            __WEBPACK_IMPORTED_MODULE_3__src_mw_grid_module__["a" /* MwGridModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwGridModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mw_grid_mw_grid_component__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mw_column_mw_column_directive__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mw_cell_mw_cell_component__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mw_grid_headers_mw_grid_headers_component__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mw_grid_mw_grid_content_host_directive__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__mw_row_mw_row_component__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__row_factory_service__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var MwGridModule = (function () {
    function MwGridModule() {
    }
    return MwGridModule;
}());
MwGridModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__mw_grid_mw_grid_component__["a" /* MwGridComponent */],
            __WEBPACK_IMPORTED_MODULE_3__mw_column_mw_column_directive__["a" /* MwColumnDirective */],
            __WEBPACK_IMPORTED_MODULE_4__mw_cell_mw_cell_component__["a" /* MwCellComponent */],
            __WEBPACK_IMPORTED_MODULE_5__mw_grid_headers_mw_grid_headers_component__["b" /* MwGridHeadersComponent */],
            __WEBPACK_IMPORTED_MODULE_6__mw_grid_mw_grid_content_host_directive__["a" /* MwGridContentHostDirective */],
            __WEBPACK_IMPORTED_MODULE_7__mw_row_mw_row_component__["a" /* MwRowComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__mw_grid_mw_grid_component__["a" /* MwGridComponent */],
            __WEBPACK_IMPORTED_MODULE_3__mw_column_mw_column_directive__["a" /* MwColumnDirective */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_8__row_factory_service__["a" /* RowFactoryService */]
        ],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_7__mw_row_mw_row_component__["a" /* MwRowComponent */]
        ]
    })
], MwGridModule);

//# sourceMappingURL=mw-grid.module.js.map

/***/ }),
/* 177 */,
/* 178 */
/***/ (function(module, exports) {

module.exports = "<div *ngFor=\"let header of headers\" class=\"mw-header\" [style.width]=\"header.width\" [style.minWidth]=\"header.minWidth\" [style.maxWidth]=\"header.maxWidth\">\n    <div>{{ header.title }}</div>\n</div>\n"

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports = "<div class=\"mw-row\" [ngClass]=\"{'mw-even': rowNumber % 2 === 0, 'mw-odd': rowNumber % 2 !== 0 }\">\n    <mw-cell *ngFor=\"let colDefinition of grid.columnDefinitions\"\n        [cellText]=\"item[colDefinition.binding]\"\n        [style.width]=\"colDefinition.getWidth()\"\n        [style.minWidth]=\"colDefinition.getMinWidth()\"\n        [style.maxWidth]=\"colDefinition.getMaxWidth()\"\n        [style.height.px]=\"height\">\n    </mw-cell>\n</div>\n"

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 182 */
/***/ (function(module, exports) {

module.exports = "<div #gridContainer class=\"mw-grid-container {{gridTheme}}\">\n    <div #gridContent class=\"grid-content\">\n        <mw-grid-headers [headers]=\"gridHeaders\"></mw-grid-headers>\n        <ng-template mw-grid-content-host></ng-template>\n    </div>\n</div>\n"

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "mw-grid>.mw-grid-container{display:inline-block;width:100%;overflow:auto;-webkit-overflow-scrolling:touch}mw-grid>.mw-grid-container .grid-content{position:relative}mw-grid>.mw-grid-container .grid-content mw-cell,mw-grid>.mw-grid-container .grid-content mw-grid-headers .mw-header{overflow:hidden;white-space:nowrap}mw-grid>.mw-grid-container .grid-content .mw-row,mw-grid>.mw-grid-container .grid-content mw-grid-headers{display:-webkit-box;display:-ms-flexbox;display:flex}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "mw-grid>.mw-grid-container.modern mw-grid-headers .mw-header{border-bottom:1px solid #bfc3c7;color:#313942}mw-grid>.mw-grid-container.modern mw-grid-headers .mw-header>div{padding:0 1em;font-weight:500}mw-grid>.mw-grid-container.modern .mw-row.mw-even mw-cell .mw-cell{background:#fff}mw-grid>.mw-grid-container.modern .mw-row.mw-odd mw-cell .mw-cell{background:#f3f5f7}mw-grid>.mw-grid-container.modern .mw-row mw-cell .mw-cell{border-bottom:1px solid #c0c3c8;color:#747c85;padding:1em 1em}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "mw-grid>.mw-grid-container.spreadsheet mw-grid-headers .mw-header>div{border-top:1px solid #000;border-left:1px solid #000;border-bottom:1px solid #000;color:#313942;background:#f4f5f6;padding:0 1em;font-weight:500}mw-grid>.mw-grid-container.spreadsheet mw-grid-headers .mw-header:last-child{border-right:1px solid #000}mw-grid>.mw-grid-container.spreadsheet .mw-row mw-cell .mw-cell{border-left:1px solid #000;border-bottom:1px solid #000;color:#747c85;padding:0 1em}mw-grid>.mw-grid-container.spreadsheet .mw-row mw-cell:last-child .mw-cell{border-right:1px solid #000}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwCellComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwCellComponent = (function () {
    function MwCellComponent() {
    }
    return MwCellComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwCellComponent.prototype, "cellText", void 0);
MwCellComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-cell',
        template: __webpack_require__(187),
        styles: [__webpack_require__(188)]
    }),
    __metadata("design:paramtypes", [])
], MwCellComponent);

//# sourceMappingURL=mw-cell.component.js.map

/***/ }),
/* 187 */
/***/ (function(module, exports) {

module.exports = "<div class=\"mw-cell\">\n    {{ cellText }}\n</div>\n"

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".mw-cell{height:100%;white-space:nowrap;overflow:hidden}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
        this.shouldShowConstructionBanner = true;
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-root',
        template: __webpack_require__(190),
        styles: [__webpack_require__(191)]
    }),
    __metadata("design:paramtypes", [])
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),
/* 190 */
/***/ (function(module, exports) {

module.exports = "<div class=\"page-container\">\n    <div *ngIf=\"shouldShowConstructionBanner\" class=\"under-construction-banner\">\n        <span>mw-grid is in early development and the api is subject to change.</span>\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"shouldShowConstructionBanner = false\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>\n    <mw-nav-menu></mw-nav-menu>\n    <div class=\"page-content\">\n        <router-outlet></router-outlet>\n    </div>\n</div>\n"

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".under-construction-banner{background:#2a5e92;color:#fff;font-size:1.2em;font-weight:200;padding:10px 15px;text-align:center}.under-construction-banner>span{display:inline-block;min-height:1.5em}.under-construction-banner button{color:#fff;opacity:1;font-size:2em;position:absolute;right:15px;top:0}.under-construction-banner button span:hover{cursor:pointer}.page-container{height:100%}.page-container,.page-container .page-content{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.page-container .page-content{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;min-height:0}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 192 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageNotFoundComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PageNotFoundComponent = (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    return PageNotFoundComponent;
}());
PageNotFoundComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-page-not-found',
        template: __webpack_require__(193),
        styles: [__webpack_require__(194)]
    }),
    __metadata("design:paramtypes", [])
], PageNotFoundComponent);

//# sourceMappingURL=page-not-found.component.js.map

/***/ }),
/* 193 */
/***/ (function(module, exports) {

module.exports = "<p>\n  page-not-found!\n</p>\n"

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocumentationComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(97);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DocumentationComponent = (function () {
    function DocumentationComponent(router) {
        var _this = this;
        this.router = router;
        this.showDocsNav = window.innerWidth >= 768 ? true : false;
        router.events.subscribe(function (newRoute) {
            _this.currentNavLocation = router.url.split('/').pop();
        });
    }
    DocumentationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.getMenuDistanceFromTop();
            _this.setMenuDimensions();
            _this.positionScrollMenu(_this.navDistanceFromTop, window.document.scrollingElement.scrollTop);
        });
    };
    DocumentationComponent.prototype.onResize = function (event) {
        this.setMenuDimensions();
        this.positionScrollMenu(this.navDistanceFromTop, window.document.scrollingElement.scrollTop);
    };
    DocumentationComponent.prototype.onScroll = function (event) {
        !this.navDistanceFromTop ? this.getMenuDistanceFromTop() :
            this.positionScrollMenu(this.navDistanceFromTop, event.srcElement.scrollingElement.scrollTop);
    };
    DocumentationComponent.prototype.positionScrollMenu = function (menuDistanceFromTop, distanceScrolled) {
        if (!this.showMobileNav && distanceScrolled > menuDistanceFromTop) {
            this.docsNavMenu.nativeElement.style.position = 'fixed';
            this.docsNavMenu.nativeElement.style.top = '0';
        }
        else {
            this.docsNavMenu.nativeElement.style.position = '';
            this.docsNavMenu.nativeElement.style.top = '';
        }
    };
    DocumentationComponent.prototype.getMenuDistanceFromTop = function () {
        if (!this.showDocsNav) {
            return;
        }
        this.navDistanceFromTop = this.docsNavMenu.nativeElement.getBoundingClientRect().top +
            window.document.scrollingElement.scrollTop;
    };
    DocumentationComponent.prototype.setMenuDimensions = function () {
        if ((this.showDocsNav && window.innerWidth < 768) || (!this.showDocsNav && window.innerWidth >= 768)) {
            this.toggleDocNav();
        }
        this.showMobileNav = window.innerWidth < 768 ? true : false;
        this.docsNavMenuHeight = window.innerWidth >= 768 ? window.innerHeight - 10 + "px" : '';
    };
    DocumentationComponent.prototype.toggleDocNav = function () {
        this.showDocsNav = window.innerWidth >= 768 ? true : !this.showDocsNav;
        this.docsNavMenu.nativeElement.style.minHeight = this.showDocsNav === true ? 'initial' : '';
    };
    return DocumentationComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('docNavMenu'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */]) === "function" && _a || Object)
], DocumentationComponent.prototype, "docsNavMenu", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* HostListener */])('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentationComponent.prototype, "onResize", null);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* HostListener */])('window:scroll', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentationComponent.prototype, "onScroll", null);
DocumentationComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-documentation',
        template: __webpack_require__(196),
        styles: [__webpack_require__(197)],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None,
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], DocumentationComponent);

var _a, _b;
//# sourceMappingURL=documentation.component.js.map

/***/ }),
/* 196 */
/***/ (function(module, exports) {

module.exports = "<mw-banner [secondaryText]=\"'Docs / API'\" [applyMargin]=\"!showMobileNav\"></mw-banner>\n<div class=\"container docs-container\">\n    <div class=\"docs-nav\" #docNavMenu [style.height]=\"docsNavMenuHeight\">\n        <div *ngIf=\"showMobileNav\" class=\"selected-nav-item\">\n            {{ currentNavLocation }}\n            <div class=\"hamburger-menu-button\" (click)=\"toggleDocNav()\">\n                <div class=\"hamburger-menu\"></div>\n            </div>\n        </div>\n        <nav *ngIf=\"showDocsNav\">\n            <div class=\"nav-section\">Getting Started</div>\n            <ul>\n                <li routerLinkActive=\"active\" routerLink=\"introduction\" (click)=\"toggleDocNav()\">\n                    <a>Introduction</a>\n                </li>\n                <li routerLinkActive=\"active\" routerLink=\"themes\" (click)=\"toggleDocNav()\">\n                    <a>Themes</a>\n                </li>\n            </ul>\n            <div class=\"nav-section\">Components</div>\n            <ul>\n                <li routerLinkActive=\"active\" routerLink=\"mw-grid\" (click)=\"toggleDocNav()\">\n                    <a>mw-grid</a>\n                </li>\n                <li routerLinkActive=\"active\" routerLink=\"mw-column\" (click)=\"toggleDocNav()\">\n                    <a>mw-column</a>\n                </li>\n            </ul>\n        </nav>\n    </div>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-12 docs-content-container\">\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".docs-container,:host{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;min-height:0}.docs-container{position:relative}@media (max-width:767px){.docs-container{padding:0}}.docs-content-container{overflow:auto}@media (min-width:768px){.docs-content-container{padding-left:180px}}.docs-content-container .doc-section{margin-bottom:2em}.docs-content-container .doc-section .section-header{color:#000;font-weight:400;font-size:1.3em;margin-bottom:.7em}.docs-content-container .doc-section p{color:#333}@media (min-width:768px){.docs-nav{width:150px;position:absolute;overflow:auto;border-right:1px solid #e8e8e8;padding-right:30px;text-align:right;z-index:1}}@media (max-width:767px){.docs-nav{min-height:3em;margin-bottom:1em;border-bottom:1px solid #e8e8e8}.docs-nav .selected-nav-item{height:3em;position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;padding-left:15px}.docs-nav nav{padding:0 15px}}.docs-nav ul{list-style:none;padding-left:0;font-size:.9em}.docs-nav ul li{padding:0}.docs-nav ul li.active,.docs-nav ul li:hover{color:#2a5e92;cursor:pointer}.docs-nav ul li.active a,.docs-nav ul li:hover a{font-weight:400}.docs-nav ul li a{font-weight:300}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 198 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SupportComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SupportComponent = (function () {
    function SupportComponent() {
    }
    SupportComponent.prototype.ngOnInit = function () {
    };
    return SupportComponent;
}());
SupportComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-support',
        template: __webpack_require__(199),
        styles: [__webpack_require__(200)]
    }),
    __metadata("design:paramtypes", [])
], SupportComponent);

//# sourceMappingURL=support.component.js.map

/***/ }),
/* 199 */
/***/ (function(module, exports) {

module.exports = "<p>\n  Support\n</p>\n"

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 201 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonateComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DonateComponent = (function () {
    function DonateComponent() {
    }
    DonateComponent.prototype.ngOnInit = function () {
    };
    return DonateComponent;
}());
DonateComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-donate',
        template: __webpack_require__(202),
        styles: [__webpack_require__(203)]
    }),
    __metadata("design:paramtypes", [])
], DonateComponent);

//# sourceMappingURL=donate.component.js.map

/***/ }),
/* 202 */
/***/ (function(module, exports) {

module.exports = "<p>\n  donate works!\n</p>\n"

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 204 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-home',
        template: __webpack_require__(205),
        styles: [__webpack_require__(206)]
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);

//# sourceMappingURL=home.component.js.map

/***/ }),
/* 205 */
/***/ (function(module, exports) {

module.exports = "<mw-banner [primaryText]=\"'An open source Angular 4 grid'\"\n    [secondaryText]=\"'Easily display a modern, fully customizable grid with enterprise quality features in your applications'\">\n</mw-banner>\n<div class=\"container\">\n    <div class=\"row mw-bootstrap-row\">\n        <div class=\"col-xs-12 col-md-6\">\n            <h4>Basic Features</h4>\n            <ul>\n                <li>Dom Virtualization</li>\n                <li>Pagination and infinite scroll (Under development)</li>\n                <li>Custom cell templates (Under development)</li>\n                <li>Dynamic column sizing</li>\n                <li>Sorting (Under development)</li>\n                <li>Searching (Under development)</li>\n            </ul>\n        </div>\n        <div class=\"col-xs-12 col-md-6\">\n            <div class=\"grid-image\"></div>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".grid-image{min-height:240px;background:url(" + __webpack_require__(207) + ");background-size:contain;background-repeat:no-repeat}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "mw-grid.1022152970a3644419db.png";

/***/ }),
/* 208 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DownloadComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DownloadComponent = (function () {
    function DownloadComponent() {
    }
    DownloadComponent.prototype.ngOnInit = function () {
    };
    return DownloadComponent;
}());
DownloadComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-download',
        template: __webpack_require__(209),
        styles: [__webpack_require__(210)]
    }),
    __metadata("design:paramtypes", [])
], DownloadComponent);

//# sourceMappingURL=download.component.js.map

/***/ }),
/* 209 */
/***/ (function(module, exports) {

module.exports = "<p>\n  download works!\n</p>\n"

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 211 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridExampleComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_mw_grid_mw_grid_component__ = __webpack_require__(100);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var GridExampleComponent = (function () {
    function GridExampleComponent() {
        this.theme = __WEBPACK_IMPORTED_MODULE_1__src_mw_grid_mw_grid_component__["b" /* MwGridTheme */].Modern;
        this.users = [
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
            { name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890' },
            { name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212' },
            { name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111' },
            { name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222' },
            { name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333' },
            { name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333' },
            { name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444' },
            { name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999' },
            { name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234' },
        ];
    }
    GridExampleComponent.prototype.ngOnInit = function () {
    };
    return GridExampleComponent;
}());
GridExampleComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-grid-example',
        template: __webpack_require__(212),
        styles: [__webpack_require__(213)],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None
    }),
    __metadata("design:paramtypes", [])
], GridExampleComponent);

//# sourceMappingURL=grid-example.component.js.map

/***/ }),
/* 212 */
/***/ (function(module, exports) {

module.exports = "<mw-grid [data]=\"users\" [theme]=\"theme\" [rowHeight]=\"55\">\n    <mw-column [binding]=\"'name'\"></mw-column>\n    <mw-column [binding]=\"'username'\" [width]=\"'1*'\" [minWidth]=\"150\"></mw-column>\n    <mw-column [binding]=\"'email'\" [width]=\"'1*'\"></mw-column>\n    <mw-column [binding]=\"'phoneNumber'\" [maxWidth]=\"150\"></mw-column>\n</mw-grid>\n"

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".mw-grid-container{height:350px}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwNavMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var VERTICAL_MENU_BREAKPOINT = 767;
var MwNavMenuComponent = (function () {
    function MwNavMenuComponent() {
        this.isMenuShown = false;
        this.windowWidth = window.innerWidth;
    }
    MwNavMenuComponent.prototype.onResize = function (event) {
        this.windowWidth = event.target.innerWidth;
        if (this.windowWidth > VERTICAL_MENU_BREAKPOINT && this.isMenuShown) {
            this.hideMenu();
        }
    };
    MwNavMenuComponent.prototype.toggleMenu = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (this.windowWidth > VERTICAL_MENU_BREAKPOINT) {
            return;
        }
        if (this.isMenuShown) {
            this.hideMenu();
        }
        else {
            this.showMenu();
        }
    };
    MwNavMenuComponent.prototype.hideMenu = function () {
        this.isMenuShown = false;
    };
    MwNavMenuComponent.prototype.showMenu = function () {
        this.isMenuShown = true;
    };
    return MwNavMenuComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* HostListener */])('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MwNavMenuComponent.prototype, "onResize", null);
MwNavMenuComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-nav-menu',
        template: __webpack_require__(215),
        styles: [__webpack_require__(216)],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None
    }),
    __metadata("design:paramtypes", [])
], MwNavMenuComponent);

//# sourceMappingURL=mw-nav-menu.component.js.map

/***/ }),
/* 215 */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-md navbar-light\">\n    <div class=\"container\">\n        <span class=\"h1\" class=\"navbar-brand\">\n            <span class=\"mw-logo\">\n                <span>MW</span><span>Grid</span>\n            </span>\n        </span>\n        <button class=\"navbar-toggler\" type=\"button\" (click)=\"toggleMenu($event)\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n\n        <div class=\"mw-grid-menu\" id=\"navbarSupportedContent\" [ngClass]=\"{'menu-shown': isMenuShown }\">\n            <ul class=\"navbar-nav ml-auto\">\n                <li class=\"nav-item\" routerLinkActive=\"active\" routerLink=\"/home\" (click)=\"toggleMenu($event)\">\n                    <a class=\"nav-link\">Home</a>\n                </li>\n                <mw-dropdown-nav-item (menuItemClick)=\"toggleMenu()\"></mw-dropdown-nav-item>\n                <li class=\"nav-item\" routerLink=\"/download\" routerLinkActive=\"active\" (click)=\"toggleMenu($event)\">\n                    <a class=\"nav-link\">Download</a>\n                </li>\n                <li class=\"nav-item\" routerLink=\"/support\" routerLinkActive=\"active\" (click)=\"toggleMenu($event)\">\n                    <a class=\"nav-link\">Support</a>\n                </li>\n                <li class=\"nav-item\" routerLink=\"/donate\" routerLinkActive=\"active\" (click)=\"toggleMenu($event)\">\n                    <a class=\"nav-link\">Donate</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n<div class=\"menu-overlay\" (click)=\"toggleMenu($event)\" [ngClass]=\"{'overlay-shown': isMenuShown }\"></div>\n"

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".mw-logo span{color:#2a5e92;font-weight:600;font-size:1.8em}.mw-logo span:first-of-type{color:#8c939b;font-weight:400;font-size:1.4em}.navbar{padding-top:0;padding-bottom:0;z-index:2001;font-family:Raleway}@media (min-width:768px){.navbar .container .navbar-nav .nav-item{padding:.6em;color:#8c939b;font-size:1.2em}.navbar .container .navbar-nav .nav-item.active,.navbar .container .navbar-nav .nav-item:focus,.navbar .container .navbar-nav .nav-item:hover{cursor:pointer;border-bottom:.1em solid #2a5e92}.navbar .container .navbar-nav .nav-item.active a,.navbar .container .navbar-nav .nav-item:focus a,.navbar .container .navbar-nav .nav-item:hover a{color:#2a5e92}}@media (max-width:767px){.navbar .mw-grid-menu{position:fixed;top:0;bottom:0;background:#fff;left:-300px;width:300px;z-index:1}.navbar .mw-grid-menu .navbar-nav .nav-item{padding-left:1em;height:3em;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.navbar .mw-grid-menu .navbar-nav .nav-item.active,.navbar .mw-grid-menu .navbar-nav .nav-item:hover{cursor:pointer;background:#e7e7e7;border-left:.5em solid #2a5e92;padding-left:.5em}.navbar .mw-grid-menu .navbar-nav .nav-item.active .nav-link,.navbar .mw-grid-menu .navbar-nav .nav-item:hover .nav-link{color:#2a5e92}}.navbar .mw-grid-menu.menu-shown{left:0}.menu-overlay{position:fixed;left:0;right:0;top:0;bottom:0;background:#000;opacity:.5;display:none;z-index:2000}.menu-overlay.overlay-shown{display:initial}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwDropdownNavItemComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwDropdownNavItemComponent = (function () {
    function MwDropdownNavItemComponent() {
        this.menuItemClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["x" /* EventEmitter */]();
    }
    MwDropdownNavItemComponent.prototype.onMenuItemClick = function (event) {
        event.preventDefault();
        this.menuItemClick.emit('MenuItemClicked');
    };
    return MwDropdownNavItemComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(),
    __metadata("design:type", Object)
], MwDropdownNavItemComponent.prototype, "menuItemClick", void 0);
MwDropdownNavItemComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-dropdown-nav-item',
        template: __webpack_require__(218),
        styles: [__webpack_require__(219)],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None
    }),
    __metadata("design:paramtypes", [])
], MwDropdownNavItemComponent);

//# sourceMappingURL=mw-dropdown-nav-item.component.js.map

/***/ }),
/* 218 */
/***/ (function(module, exports) {

module.exports = "<li class=\"nav-item dropdown\" routerLinkActive=\"active\">\n    <a class=\"nav-link dropdown-toggle\">Docs</a>\n    <div class=\"dropdown-menu\">\n        <a class=\"dropdown-item\" routerLink=\"/documentation/api\" routerLinkActive=\"active\" (click)=\"onMenuItemClick($event)\">API Docs</a>\n        <a class=\"dropdown-item\" routerLink=\"/documentation/examples\" routerLinkActive=\"active\" (click)=\"onMenuItemClick($event)\">Live Examples</a>\n    </div>\n</li>\n"

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "@media (min-width:768px){.navbar .mw-grid-menu .navbar-nav .nav-item:hover .dropdown-menu{background-color:#313942}.navbar .mw-grid-menu .navbar-nav .nav-item:hover .dropdown-menu .dropdown-item{height:2.7em;color:#8c939b;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.navbar .mw-grid-menu .navbar-nav .nav-item:hover .dropdown-menu .dropdown-item.active,.navbar .mw-grid-menu .navbar-nav .nav-item:hover .dropdown-menu .dropdown-item:focus,.navbar .mw-grid-menu .navbar-nav .nav-item:hover .dropdown-menu .dropdown-item:hover{background-color:#747c85;color:#fff}.navbar .mw-grid-menu .navbar-nav .dropdown:hover .dropdown-toggle+.dropdown-menu{top:3.6em;left:.6em;display:block}}@media (max-width:767px){.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;height:100%;padding:0;border-left:0;background:#fff}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown:hover .nav-link{color:#8c939b}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .nav-link.dropdown-toggle{width:100%;padding-left:1em;height:3em;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .nav-link.dropdown-toggle.active,.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .nav-link.dropdown-toggle:hover{color:#2a5e92;background:#e7e7e7;border-left:.5em solid #2a5e92;padding-left:.5em}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown:hover .dropdown-menu{top:auto;left:auto}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .dropdown-menu{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:100%;padding:0;border-top:1px solid #e7e7e7;border-bottom:1px solid #e7e7e7}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .dropdown-menu:before{display:none}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .dropdown-menu .dropdown-item{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%;height:3em;padding-left:2em}.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .dropdown-menu .dropdown-item.active,.navbar .mw-grid-menu .navbar-nav .nav-item.dropdown .dropdown-menu .dropdown-item:hover{color:#2a5e92;background:#e7e7e7;border-left:.5em solid #2a5e92;padding-left:1.5em}}.navbar .mw-grid-menu .navbar-nav .dropdown-toggle:after{display:none}.navbar .mw-grid-menu .navbar-nav .dropdown-menu:before{content:\"\";position:absolute;left:11px;top:-10px;width:0;height:0;border-style:solid;border-width:0 10px 10px 10px;border-color:transparent transparent #313942 transparent;z-index:9999}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 220 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwLiveExampleComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwLiveExampleComponent = (function () {
    function MwLiveExampleComponent() {
    }
    return MwLiveExampleComponent;
}());
MwLiveExampleComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-live-example',
        template: __webpack_require__(221),
        styles: [__webpack_require__(222)]
    }),
    __metadata("design:paramtypes", [])
], MwLiveExampleComponent);

//# sourceMappingURL=mw-live-example.component.js.map

/***/ }),
/* 221 */
/***/ (function(module, exports) {

module.exports = "<mw-banner [secondaryText]=\"'Docs / Live Example'\"></mw-banner>\n<div class=\"container\">\n    <div class=\"row mw-bootstrap-row\">\n        <div class=\"col-12\">\n            <mw-grid-example></mw-grid-example>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwBannerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwBannerComponent = (function () {
    function MwBannerComponent() {
    }
    MwBannerComponent.prototype.ngOnInit = function () {
        this.setBannerMargin();
    };
    MwBannerComponent.prototype.ngOnChanges = function () {
        this.setBannerMargin();
    };
    MwBannerComponent.prototype.setBannerMargin = function () {
        this.bannerMargin = this.applyMargin === false ? '0' : '2.5em';
    };
    return MwBannerComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwBannerComponent.prototype, "primaryText", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwBannerComponent.prototype, "secondaryText", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Boolean)
], MwBannerComponent.prototype, "applyMargin", void 0);
MwBannerComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-banner',
        template: __webpack_require__(224),
        styles: [__webpack_require__(225)]
    }),
    __metadata("design:paramtypes", [])
], MwBannerComponent);

//# sourceMappingURL=mw-banner.component.js.map

/***/ }),
/* 224 */
/***/ (function(module, exports) {

module.exports = "<div class=\"banner-container\" [style.marginBottom]=\"bannerMargin\">\n    <div class=\"container\">\n        <div *ngIf=\"primaryText\" class=\"row\">\n            <div class=\"col-12 primary-text\">\n                {{ primaryText }}\n            </div>\n        </div>\n        <div *ngIf=\"secondaryText\" class=\"row\">\n            <div class=\"col-12 secondary-text\">\n                {{ secondaryText }}\n            </div>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".banner-container{background:linear-gradient(45deg,#036,#2777b0 50%,#4fa49a 95%);width:100%;color:#fff;padding:2.5em 0;font-family:Raleway}.banner-container .primary-text{font-size:2.2em;font-weight:200;padding-bottom:.3em}.banner-container .secondary-text{font-size:1.3em;font-weight:100}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwGridDocsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwGridDocsComponent = (function () {
    function MwGridDocsComponent() {
    }
    MwGridDocsComponent.prototype.ngOnInit = function () {
    };
    return MwGridDocsComponent;
}());
MwGridDocsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-grid-docs',
        template: __webpack_require__(227),
        styles: [__webpack_require__(228)]
    }),
    __metadata("design:paramtypes", [])
], MwGridDocsComponent);

//# sourceMappingURL=mw-grid-docs.component.js.map

/***/ }),
/* 227 */
/***/ (function(module, exports) {

module.exports = "<mw-component-header-doc [componentName]=\"'MwGridComponent'\" [selector]=\"'mw-grid'\" [link]=\"'https://github.com/TheWiech/mw-grid/blob/master/src/mw-grid/mw-grid.component.ts'\"></mw-component-header-doc>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Overview</div>\n    <p>The MwGridComponent is a fully featured control that displays a set of data in a grid. MwGridComponent includes features such as dynamic column sizing, row virtualization, filtering, searching, sorting, pagination, etc.</p>\n    <p>The most basic configuration of the grid requires setting the data property and bindings for values to display. To utilize advanced features such as dynamic column sizing MwColumnDirectives must be nested in the grid.</p>\n</div>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Bindings</div>\n    <div>\n        <mw-binding-doc binding=\"data\" type=\"Array&lt;any&gt;\">\n            (Required) Array of data to display in the grid.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"bindings\" type=\"Array&lt;String&gt;\">\n            Array of keys on the objects in the data array that contain values to display in a column. This property is ignored if MwColumnComponent is present.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"theme\" type=\"MwGridTheme\">\n            The style applied to the grid. Defaults to MwGridTheme.Modern.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"rowHeight\" type=\"Number\">\n            The height of rows in px\n        </mw-binding-doc>\n    </div>\n</div>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Examples</div>\n</div>\n"

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwColumnDocsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwColumnDocsComponent = (function () {
    function MwColumnDocsComponent() {
    }
    MwColumnDocsComponent.prototype.ngOnInit = function () {
    };
    return MwColumnDocsComponent;
}());
MwColumnDocsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-column-docs',
        template: __webpack_require__(230),
        styles: [__webpack_require__(231)]
    }),
    __metadata("design:paramtypes", [])
], MwColumnDocsComponent);

//# sourceMappingURL=mw-column-docs.component.js.map

/***/ }),
/* 230 */
/***/ (function(module, exports) {

module.exports = "<mw-component-header-doc [componentName]=\"'MwColumnDirective'\" [selector]=\"'mw-column'\" [link]=\"'https://github.com/TheWiech/mw-grid/blob/master/src/mw-column/mw-column.directive.ts'\"></mw-component-header-doc>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Overview</div>\n    <p>The MwColumnDirective is used to define and customize the behaivor of a columnn in the grid. The directive must be a direct child of mw-grid.</p>\n    <p>\n        If width, minWidth, and maxWidth are not set the column defaults to a fixed width of 150px. If the minWidth is set and no maxWidth or width is set\n        the minWidth is used as the width. If the maxWidth is set and no minWidth or width is set the maxWidth is used as the width.\n    </p>\n</div>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Bindings</div>\n    <div>\n        <mw-binding-doc binding=\"binding\" type=\"String\">\n            (Required) The property on the item containing the text to display.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"width\" type=\"String\">\n            The width of the column. The value can be expressed in pixels or a star sized value. Star sized values allow\n            the column to dynimcally resize based on the remaining space available after non star sized columns widths have\n            been detirmined and compared to other star sized colums. E.g. If a grid has two columns and the fist column has\n            a width of 1* and the second column has a width of 2* the first column's width will be 33% of available space\n            and the second column's width will be 66% of available space.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"minWidth\" type=\"Number\">\n            The minimum width of the column in pixels. If width is set this value will have no affect.\n        </mw-binding-doc>\n        <mw-binding-doc binding=\"maxWidth\" type=\"Number\">\n            The maximum width of the column in pixels. If width is set this value will have no affect.\n        </mw-binding-doc>\n    </div>\n</div>\n<div class=\"doc-section\">\n    <div class=\"section-header\">Examples</div>\n</div>\n"

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 232 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntroductionDocsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IntroductionDocsComponent = (function () {
    function IntroductionDocsComponent() {
    }
    IntroductionDocsComponent.prototype.ngOnInit = function () {
    };
    return IntroductionDocsComponent;
}());
IntroductionDocsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-introduction-docs',
        template: __webpack_require__(233),
        styles: [__webpack_require__(234)]
    }),
    __metadata("design:paramtypes", [])
], IntroductionDocsComponent);

//# sourceMappingURL=introduction-docs.component.js.map

/***/ }),
/* 233 */
/***/ (function(module, exports) {

module.exports = "<h2>Introduction</h2>\n\n"

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 235 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ThemesDocsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ThemesDocsComponent = (function () {
    function ThemesDocsComponent() {
    }
    ThemesDocsComponent.prototype.ngOnInit = function () {
    };
    return ThemesDocsComponent;
}());
ThemesDocsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-themes-docs',
        template: __webpack_require__(236),
        styles: [__webpack_require__(237)]
    }),
    __metadata("design:paramtypes", [])
], ThemesDocsComponent);

//# sourceMappingURL=themes-docs.component.js.map

/***/ }),
/* 236 */
/***/ (function(module, exports) {

module.exports = "<h2>Themes</h2>\n"

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwButtonComponent = (function () {
    function MwButtonComponent() {
    }
    return MwButtonComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwButtonComponent.prototype, "link", void 0);
MwButtonComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-button',
        template: __webpack_require__(239),
        styles: [__webpack_require__(240)]
    }),
    __metadata("design:paramtypes", [])
], MwButtonComponent);

//# sourceMappingURL=mw-button.component.js.map

/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports = "<button class=\"mw-button\">\n    <a href=\"{{ link }}\" target=\"_blank\">View Source</a>\n</button>\n"

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".mw-button{background:#fff;border:1px solid #2a5e92;border-radius:5px;padding:.4em 1em}.mw-button:hover{background:#2a5e92}.mw-button:hover a{color:#fff}.mw-button a{color:#2a5e92}.mw-button a:hover{text-decoration:none}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 241 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwBindingDocComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwBindingDocComponent = (function () {
    function MwBindingDocComponent() {
    }
    MwBindingDocComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.contentHtml = _this.projectedContent.nativeElement.innerHTML;
        });
    };
    return MwBindingDocComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwBindingDocComponent.prototype, "binding", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwBindingDocComponent.prototype, "type", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('contentWrapper'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */]) === "function" && _a || Object)
], MwBindingDocComponent.prototype, "projectedContent", void 0);
MwBindingDocComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-binding-doc',
        template: __webpack_require__(242),
        styles: [__webpack_require__(243)]
    }),
    __metadata("design:paramtypes", [])
], MwBindingDocComponent);

var _a;
//# sourceMappingURL=mw-binding-doc.component.js.map

/***/ }),
/* 242 */
/***/ (function(module, exports) {

module.exports = "<div class=\"desktop-layout\">\n    <div class=\"input-definition\">\n        <span class=\"property\">{{ binding }}</span>\n    </div>\n    <div class=\"input-description\">\n        <span class=\"type\">{{ type }}</span>\n        <span class=\"definition\" #contentWrapper>\n            <ng-content></ng-content>\n        </span>\n    </div>\n</div>\n\n<div class=\"mobile-layout\">\n    <div class=\"def-container\">\n        <span class=\"property\">{{ binding }} </span>\n        <span class=\"type\">{{ type }}</span>\n    </div>\n    <div>\n        <span class=\"definition\">\n            {{ contentHtml }}\n        </span>\n    </div>\n</div>\n"

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".desktop-layout{display:-webkit-box;display:-ms-flexbox;display:flex}.desktop-layout .input-definition{width:120px;min-width:120px}.desktop-layout .input-definition .property{width:100%;text-align:right;padding-right:.5em}.desktop-layout .type{padding-right:.5em}.mobile-layout{display:none;margin-bottom:1.5em}.type{color:#2a5e92;font-weight:500}.property{display:inline-block;font-weight:500}@media screen and (max-width:576px){.desktop-layout{display:none}.mobile-layout{display:block}}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 244 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MwComponentHeaderDocsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MwComponentHeaderDocsComponent = (function () {
    function MwComponentHeaderDocsComponent() {
    }
    return MwComponentHeaderDocsComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwComponentHeaderDocsComponent.prototype, "componentName", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwComponentHeaderDocsComponent.prototype, "selector", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], MwComponentHeaderDocsComponent.prototype, "link", void 0);
MwComponentHeaderDocsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'mw-component-header-doc',
        template: __webpack_require__(245),
        styles: [__webpack_require__(246)]
    })
], MwComponentHeaderDocsComponent);

//# sourceMappingURL=mw-component-header-doc.component.js.map

/***/ }),
/* 245 */
/***/ (function(module, exports) {

module.exports = "<div class=\"component-doc-header\">\n    <div class=\"component-info\">\n        <span class=\"component-name\">{{ componentName }}</span>\n        <p class=\"selector\"><span>Selector:</span> {{ selector }}</p>\n    </div>\n    <mw-button [link]=\"link\"></mw-button>\n</div>\n"

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, ".component-doc-header{margin-bottom:1.6em}.component-doc-header .component-info{display:inline-block}.component-doc-header .component-info .component-name{font-size:1.7em;font-weight:400}.component-doc-header .component-info .selector{font-size:.9em;font-weight:300}.component-doc-header .component-info .selector span{font-weight:500}.component-doc-header mw-button{float:right}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
]),[143]);
//# sourceMappingURL=main.bundle.js.map