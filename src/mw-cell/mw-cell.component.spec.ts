import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { MwRowComponent, RowType } from '../mw-row/mw-row.component';
import { MwCellComponent } from './mw-cell.component';

class MockMwRowComponent extends MwRowComponent { }

describe('MwCellComponent', () => {
    let component: MwCellComponent;
    let fixture:   ComponentFixture<MwCellComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            MwCellComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwCellComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        component.row = new MockMwRowComponent();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should have mw-cell class on top level element', () => {
        fixture.detectChanges();
        expect(el.children[0].classList.contains('mw-cell')).toEqual(true);
    });

    it('should set cssClass on top level element', () => {
        component.cellClass = 'test-class';
        fixture.detectChanges();
        expect(el.children[0].classList.contains('test-class')).toEqual(true);
    });

    it('should set $implicit on cellContext', () => {
        component.cellContext = {};
        component.item = { title: 'testItem' };
        component.ngOnInit();
        expect(component.cellContext['$implicit']).toEqual(component.item);
    });

    it('should set rowNumber on cellContext', () => {
        component.cellContext = {};
        component.row.rowNumber = 55;
        component.item = { title: 'testItem' };
        component.ngOnInit();
        expect(component.cellContext['rowNumber']).toEqual(55);
    });

    it('should display cellText in cell when no template is used', () => {
        component.row.rowType = RowType.Content;
        component.item = { cellText: 'Grid Cell Text' };
        component.binding = 'cellText';
        fixture.detectChanges();
        expect(el.children[0].children[0].innerHTML.trim()).toEqual(component.item.cellText);
    });
});
