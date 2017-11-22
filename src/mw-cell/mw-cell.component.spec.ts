import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { MwCellComponent } from './mw-cell.component';

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
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should have mw-cell class on top level element', () => {
        expect(el.children[0].classList.contains('mw-cell')).toEqual(true);
    });

    it('should display cellText in cell', () => {
        component.cellText = 'Grid Cell Text';
        fixture.detectChanges();
        expect(el.children[0].innerHTML.trim()).toEqual(component.cellText);
    });
});
