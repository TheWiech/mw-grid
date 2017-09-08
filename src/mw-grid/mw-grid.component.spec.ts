import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { MwGridComponent } from './mw-grid.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({selector: 'mw-cell', template: '<div class="mock-mw-cell"></div>'})
export class MwCell { }

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-grid [data]=mockData>
                <mw-column></mw-column>
                <mw-column></mw-column>
                <mw-column></mw-column>
            </mw-grid>`,
    })
    class MwTestWrapperComponent {
        mockData = ['test1']
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
});
