import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, Component, Directive, Input, QueryList, ChangeDetectorRef } from '@angular/core';

import { MwRowComponent, RowType } from './mw-row.component';
import { MwGridComponent } from '../mw-grid/mw-grid.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';
import { RowFactoryService } from '../row-factory.service';

class MwGridComponentMock extends MwGridComponent { }
class mockRowFactoryService extends RowFactoryService { }
class MwColumnDirectiveStub extends MwColumnDirective {
    binding: string;
    minWidth: number;
    maxWidth: number;
    item: any;
    cellClass: string;

    getMinWidth() {
        return `${ this.minWidth }px`;
    }

    getMaxWidth() {
        return `${ this.maxWidth }px`;
    }

    getWidth() {
        return `${ this.width }px`;
    }
}

describe('MwRowComponent', () => {
    let component: MwRowComponent;
    let fixture:   ComponentFixture<MwRowComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            MwRowComponent
        ],
        providers: [
            { provide: RowFactoryService, useClass: mockRowFactoryService },
            { provide: ChangeDetectorRef, useClass: ChangeDetectorRef }
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwRowComponent);
        component = fixture.componentInstance;

        let rowFactoryService = TestBed.get(RowFactoryService);
        let changeDetectorRef = TestBed.get(ChangeDetectorRef);
        component.grid = new MwGridComponentMock(rowFactoryService, changeDetectorRef);
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should apply "mw-even" class to even rows', () => {
        component.rowNumber = 2;
        component.rowType = RowType.Content;
        fixture.detectChanges();
        expect(el.children[0].classList.contains('mw-even')).toEqual(true);
    });

    it('should apply "mw-odd" class to odd rows', () => {
        component.rowNumber = 1;
        component.rowType = RowType.Content;
        fixture.detectChanges();
        expect(el.children[0].classList.contains('mw-odd')).toEqual(true);
    });
});

@Component({
    selector: 'mw-cell',
    template: `<div class="mock-mw-cell"></div>`
})
class MockMwCell { }

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-row [item]="mockItem" [height]="70">
    </mw-row>`
})
class MwTestWrapperComponent {
    mockItem: any;

    constructor() {
        this.mockItem = {
            firstName: 'Matthew',
            lastName: 'Wiechec'
        }
    }
}

describe('MwRowComponent', () => {
    let component: MwRowComponent;
    let fixture:   ComponentFixture<MwTestWrapperComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    let colDefinition1: MwColumnDirectiveStub;
    let colDefinition2: MwColumnDirectiveStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            MwTestWrapperComponent,
            MwColumnDirective,
            MockMwCell,
            MwRowComponent
        ],
        providers: [
            { provide: RowFactoryService, useClass: mockRowFactoryService },
            { provide: ChangeDetectorRef, useClass: ChangeDetectorRef }
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwTestWrapperComponent);
        component = <MwRowComponent>fixture.debugElement.children[0].componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        let rowFactoryService = TestBed.get(RowFactoryService);
        let changeDetectorRef = TestBed.get(ChangeDetectorRef);
        component.grid = new MwGridComponentMock(rowFactoryService, changeDetectorRef);

        colDefinition1 = new MwColumnDirectiveStub();
        colDefinition1.minWidth = 1;
        colDefinition1.width = '20';
        colDefinition1.maxWidth = 2;
        colDefinition1.binding = 'firstName';
        colDefinition1.cellClass = 'col-1-class';
        colDefinition2 = new MwColumnDirectiveStub();
        colDefinition2.minWidth = 10;
        colDefinition2.width = '21';
        colDefinition2.maxWidth = 20;
        colDefinition2.binding = 'lastName';
        colDefinition2.cellClass = 'col-2-class';

        let contentChildren = new QueryList<MwColumnDirective>();
        contentChildren.reset([colDefinition1, colDefinition2]);
        component.grid.columnDefinitions = contentChildren;
    });

    it('should create mw-cell for each columnDefition in the grid', () => {
        fixture.detectChanges();
        expect(de.nativeElement.querySelectorAll('.mock-mw-cell').length).toEqual(2);
    });

    it('should assign row, item, binding, row, width, minWidth, maxWidth, and cellClass attribute to each cell', () => {
        fixture.detectChanges();
        const firstCell = de.nativeElement.querySelectorAll('mw-cell')[0];
        expect(firstCell.style.width).toEqual('20px');
        expect(firstCell.style.minWidth).toEqual('1px');
        expect(firstCell.style.maxWidth).toEqual('2px');
        expect(firstCell.item).toEqual({
            firstName: 'Matthew',
            lastName: 'Wiechec'
        });
        expect(firstCell.binding).toEqual('firstName');
        expect(firstCell.cellClass).toEqual('col-1-class');
        expect(firstCell.row).toEqual(component);

        const secondCell = de.nativeElement.querySelectorAll('mw-cell')[1];
        expect(secondCell.style.width).toEqual('21px');
        expect(secondCell.style.minWidth).toEqual('10px');
        expect(secondCell.style.maxWidth).toEqual('20px');
        expect(secondCell.item).toEqual({
            firstName: 'Matthew',
            lastName: 'Wiechec'
        });
        expect(secondCell.cellClass).toEqual('col-2-class');
        expect(secondCell.binding).toEqual('lastName');
        expect(secondCell.row).toEqual(component);
    });

    it('should set height of each row', () => {
        fixture.detectChanges();
        const firstCell = de.nativeElement.querySelectorAll('mw-cell')[0];
        expect(firstCell.style.height).toEqual('70px');

        const secondCell = de.nativeElement.querySelectorAll('mw-cell')[1];
        expect(secondCell.style.height).toEqual('70px');
    });
});
