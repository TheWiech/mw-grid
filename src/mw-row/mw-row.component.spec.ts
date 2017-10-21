import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, Component, Directive, Input } from '@angular/core';

import { MwRowComponent } from './mw-row.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

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
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwRowComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should apply "mw-even" class to even rows', () => {
        component.rowNumber = 2;
        fixture.detectChanges();
        expect(el.children[0].classList.contains('mw-even')).toEqual(true);
    });

    it('should apply "mw-odd" class to odd rows', () => {
        component.rowNumber = 1;
        fixture.detectChanges();
        expect(el.children[0].classList.contains('mw-odd')).toEqual(true);
    });
});

export class MwColumnDirectiveStub extends MwColumnDirective {
    binding: String;
    calculatedWidth: String;
    minWidth: Number;
    maxWidth: Number;

    getMinWidth() {
        return `${ this.minWidth }px`;
    }

    getMaxWidth() {
        return `${ this.maxWidth }px`;
    }
}

@Component({
    selector: 'mw-cell',
    template: `<div class="mock-mw-cell"></div>`
})
class MockMwCell { }

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-row [columnDefinitions]="mockColumnDefs" [item]="mockItem">
    </mw-row>`
})
class MwTestWrapperComponent {
    mockColumnDefs: Array<MwColumnDirective> = [];
    mockItem: any;

    constructor() {
        const columnDefinition1 = new MwColumnDirective();
        columnDefinition1.binding = 'firstName';
        columnDefinition1.calculatedWidth = '10px';
        columnDefinition1.minWidth = 9;
        columnDefinition1.maxWidth = 11;

        const columnDefinition2 = new MwColumnDirective();
        columnDefinition2.binding = 'lastName';
        columnDefinition2.calculatedWidth = '20px';
        columnDefinition2.minWidth = 19;
        columnDefinition2.maxWidth = 21;

        this.mockColumnDefs.push(columnDefinition1);
        this.mockColumnDefs.push(columnDefinition2);

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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            MwTestWrapperComponent,
            MwColumnDirective,
            MockMwCell,
            MwRowComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwTestWrapperComponent);
        component = <MwRowComponent>fixture.debugElement.children[0].componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should create mw-cell for each columnDefition', () => {
        fixture.detectChanges();
        expect(de.nativeElement.querySelectorAll('.mock-mw-cell').length).toEqual(2);
    });

    it('should assign cellText, width, minWidth, maxWidth attribute to each cell', () => {
        fixture.detectChanges();
        const firstCell = de.nativeElement.querySelectorAll('mw-cell')[0];
        expect(firstCell.style.width).toEqual('10px');
        expect(firstCell.style.minWidth).toEqual('9px');
        expect(firstCell.style.maxWidth).toEqual('11px');
        expect(firstCell.cellText).toEqual('Matthew');

        const secondCell = de.nativeElement.querySelectorAll('mw-cell')[1];
        expect(secondCell.style.width).toEqual('20px');
        expect(secondCell.style.minWidth).toEqual('19px');
        expect(secondCell.style.maxWidth).toEqual('21px');
        expect(secondCell.cellText).toEqual('Wiechec');
    });
});
