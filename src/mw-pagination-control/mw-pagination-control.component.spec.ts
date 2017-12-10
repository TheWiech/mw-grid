import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwPaginationControlComponent } from './mw-pagination-control.component';

describe('MwPaginationControlComponent', () => {
    let component: MwPaginationControlComponent;
    let fixture:   ComponentFixture<MwPaginationControlComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            MwPaginationControlComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwPaginationControlComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should create six page options on large screen', () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            fixture.detectChanges();
            component.currentPage = 1;
            component.totalPages = 10;

            component.ngOnInit();

            expect(component.selectablePages).toEqual([1,2,3,4,5,6]);
        });

        it('should create 4 page options on small screens', () => {
            component.paginationContainer.nativeElement.style.width = '799px';
            fixture.detectChanges();
            component.currentPage = 1;
            component.totalPages = 10;

            component.ngOnInit();

            expect(component.selectablePages).toEqual([1,2,3,4]);
        });

        it('should add page options before currentPage if cannot add enough after', () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            fixture.detectChanges();
            component.currentPage = 9;
            component.totalPages = 10;

            component.ngOnInit();

            expect(component.selectablePages).toEqual([5,6,7,8,9,10]);
        });

        it('should create as many pages as possible if there are less than 6 total pages', () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            fixture.detectChanges();
            component.currentPage = 1;
            component.totalPages = 3;

            component.ngOnInit();

            expect(component.selectablePages).toEqual([1,2,3]);
        });
    });

    describe('ngOnChanges', () => {
        it(`should add new selectable page at end of options if last option is selected and there are more pages`, () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            component.selectablePages = [1,2,3,4,5,6];
            component.totalPages = 10;

            component.currentPage = 6;
            component.ngOnChanges({currentPage: new SimpleChange(1, component.currentPage, false)});

            expect(component.selectablePages).toEqual([2,3,4,5,6,7]);
        });

        it(`should add new selectable page at beginning of options if first option is selected and there are more pages`, () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            component.selectablePages = [2,3,4,5,6,7];
            component.totalPages = 10;

            component.currentPage = 2;
            component.ngOnChanges({currentPage: new SimpleChange(3, component.currentPage, false)});

            expect(component.selectablePages).toEqual([1,2,3,4,5,6]);
        });

        it(`should not add new selectable page at end of options if last option is selected and there are no more pages`, () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            component.selectablePages = [5,6,7,8,9,10];
            component.totalPages = 10;

            component.currentPage = 10;
            component.ngOnChanges({currentPage: new SimpleChange(9, component.currentPage, false)});

            expect(component.selectablePages).toEqual([5,6,7,8,9,10]);
        });

        it(`should not add new selectable page at beginning of options if first option is selected and there are not more pages`, () => {
            component.paginationContainer.nativeElement.style.width = '801px';
            component.selectablePages = [1,2,3,4,5,6];
            component.totalPages = 10;

            component.currentPage = 1;
            component.ngOnChanges({currentPage: new SimpleChange(2, component.currentPage, false)});

            expect(component.selectablePages).toEqual([1,2,3,4,5,6]);
        });
    });

    describe('ngDoCheck', () => {
        it(`should show four pages when pagination component has been placed in small container`, () => {
            component.paginationContainer.nativeElement.style.width = '800px';
            component.currentPage = 1;
            component.totalPages = 10;
            fixture.detectChanges();

            component.paginationContainer.nativeElement.style.width = '799px';
            component.ngDoCheck();

            expect(component.selectablePages).toEqual([1,2,3,4]);
        });

        it(`should show six pages when pagination component has been placed in large container`, () => {
            component.paginationContainer.nativeElement.style.width = '799px';
            component.currentPage = 1;
            component.totalPages = 10;
            fixture.detectChanges();

            component.paginationContainer.nativeElement.style.width = '800px';
            component.ngDoCheck();

            expect(component.selectablePages).toEqual([1,2,3,4,5,6]);
        });
    });
});
