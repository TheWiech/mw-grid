import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, DebugElement, Input, QueryList, NO_ERRORS_SCHEMA, ComponentFactoryResolver } from '@angular/core';

import { MwGridComponent, MwGridTheme } from './mw-grid.component';
import { MwGridHeader } from '../mw-grid-headers/mw-grid-headers.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';
import { MwRowComponent } from '../mw-row/mw-row.component';
import { RowFactoryService } from '../row-factory.service';
import { MwGridContentHostDirective } from './mw-grid-content-host.directive';

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-grid [data]=mockData [theme]=theme>
        <mw-column width="1*" binding="col1Header"></mw-column>
        <mw-column width="3*" binding="col2Header"></mw-column>
        <mw-column binding="col3Header"></mw-column>
    </mw-grid>`
})
class MwTestWrapperComponent {
    mockData = ['test1'];
    theme: MwGridTheme;
}

class mockRowFactoryService {
    rowHeight: Number;
    createRow = () => { };
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
            MwTestWrapperComponent,
            MwColumnDirective,
            MwGridContentHostDirective
        ],
        providers: [ { provide: RowFactoryService, useClass: mockRowFactoryService } ],
        schemas: [NO_ERRORS_SCHEMA]
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

    describe('ngAfterViewInit method', () => {
        it(`should call configureColumnDefinitions, getStartSizedColumnTotal,
                configureRowFactory, setGridHeaders and createRows`, <any>fakeAsync((): void => {
            spyOn(component, 'configureColumnDefinitions');
            spyOn(component, 'getStartSizedColumnTotal');
            spyOn(component, 'configureRowFactory');
            spyOn(component, 'setGridHeaders');
            spyOn(component, 'createRows');
            component.ngAfterViewInit();
            tick();
            expect(component.configureColumnDefinitions).toHaveBeenCalled();
            expect(component.getStartSizedColumnTotal).toHaveBeenCalled();
            expect(component.configureRowFactory).toHaveBeenCalled();
            expect(component.setGridHeaders).toHaveBeenCalled();
            expect(component.createRows).toHaveBeenCalled();
        }));
    });

    describe('createRows method', () => {
        it('should call rowFactory.createRow for each item in the data array', () => {
            component.data = ['item1', 'item2', 'item3'];
            const rowFactoryService = TestBed.get(RowFactoryService);
            spyOn(rowFactoryService, 'createRow').and.returnValue({instance: {
                item: '',
                rowNumber: ''
            }});
            component.createRows();
            expect(rowFactoryService.createRow.calls.count()).toEqual(3);
        });

        it('should set rowNumber on each row', () => {
            component.data = ['item1', 'item2'];
            const rowFactoryService = TestBed.get(RowFactoryService);
            spyOn(rowFactoryService, 'createRow').and.callFake(() => {
                return {
                    instance: {
                        item: '',
                        rowNumber: ''
                    }
                };
            });
            component.createRows();
            expect(component.rows[0].instance.rowNumber).toEqual(0);
            expect(component.rows[1].instance.rowNumber).toEqual(1);
        });
    });

    describe('configureRowFactory method', () =>{
        it('should set rowHeight of rowFactory', () => {
            const rowFactoryMock = TestBed.get(RowFactoryService);
            rowFactoryMock.rowHeight = 10;
            component.rowHeight = 20;
            component.configureRowFactory();
            expect(rowFactoryMock.rowHeight).toEqual(20);
        });
    });

    describe('getStartSizedColumnTotal method', () => {
        it('should calculate starSizeTotalWidth', () => {
            fixture.detectChanges();
            component.starSizeTotalWidth = 0;
            component.getStartSizedColumnTotal();
            expect(component.starSizeTotalWidth).toEqual(4);
        });
    });

    describe('configureColumnDefinitions method', () => {
        it('should set grid on each column definition', () => {
            fixture.detectChanges();
            component.configureColumnDefinitions();
            var colDefinitions = component.columnDefinitions.toArray();

            expect(colDefinitions[0].grid).toEqual(component);
            expect(colDefinitions[1].grid).toEqual(component);
            expect(colDefinitions[2].grid).toEqual(component);
        });
    });
});
