import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { MwGridComponent, MwGridTheme } from './mw-grid.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({selector: 'mw-cell', template: '<div class="mock-mw-cell"></div>'})
export class MwCell { }

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-grid [data]=mockData [theme]=theme>
                <mw-column></mw-column>
                <mw-column></mw-column>
                <mw-column></mw-column>
            </mw-grid>`,
    })
    class MwTestWrapperComponent {
        mockData = ['test1'];
        theme: MwGridTheme;
    }

describe('MwGridComponent', () => {
    let component: MwGridComponent;
    let fixture:   ComponentFixture<MwTestWrapperComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
        declarations: [
            MwGridComponent,
            MwCell,
            MwTestWrapperComponent,
            MwColumnDirective
        ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwTestWrapperComponent);
        component = <MwGridComponent>fixture.debugElement.children[0].componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('set theme class on grid container to modern as default', () => {
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.mw-grid-container').classList.contains('modern')).toEqual(true);
    });

    it('should create 3 mw-cells when there is a single row with three columns', () => {
        fixture.detectChanges();
        expect(de.nativeElement.querySelectorAll('.mock-mw-cell').length).toEqual(3);
    });

    it('should create 6 mw-cells when there are two rows with three columns', () => {
        fixture.componentInstance.mockData = ['test1', 'test2'];
        fixture.detectChanges();
        expect(de.nativeElement.querySelectorAll('.mock-mw-cell').length).toEqual(6);
    });

    it('should create 1 row for each item in the grid data', () => {
        fixture.componentInstance.mockData = ['test1', 'test2'];
        fixture.detectChanges();
        expect(de.nativeElement.querySelectorAll('.mw-row').length).toEqual(2);
    });

    it('should apply "mw-even" class to even rows', () => {
        fixture.componentInstance.mockData = ['test1', 'test2', 'test3'];
        fixture.detectChanges();
        // Remember even/odd is determined on 0 based index
        expect(de.nativeElement.querySelectorAll('.mw-row.mw-even').length).toEqual(2);
    });

    it('should apply "mw-odd" class to odd rows', () => {
        fixture.componentInstance.mockData = ['test1', 'test2', 'test3'];
        fixture.detectChanges();
        // Remember even/odd is determined on 0 based index
        expect(de.nativeElement.querySelectorAll('.mw-row.mw-odd').length).toEqual(1);
    });

    describe('setGridTheme method', () => {
        it('should set gridTheme="modern" as default', () => {
            component.theme = undefined;
            component.setGridTheme();
            expect(component.gridTheme).toEqual('modern');
        });

        it('should set gridTheme="modern" when theme input is MwGridTheme.Modern', () => {
            component.theme = MwGridTheme.Modern;
            component.setGridTheme();
            expect(component.gridTheme).toEqual('modern');
        });

        it('should set gridTheme="spreadsheet" when theme input is MwGridTheme.Spreadsheet', () => {
            component.theme = MwGridTheme.Spreadsheet;
            component.setGridTheme();
            expect(component.gridTheme).toEqual('spreadsheet');
        });
    });

    describe('ngOnInit method', () => {
        it('should call setGridTheme', () => {
            spyOn(component, 'setGridTheme');
            component.ngOnInit();
            expect(component.setGridTheme).toHaveBeenCalled();
        });
    });
});
