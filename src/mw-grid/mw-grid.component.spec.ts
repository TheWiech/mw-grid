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
        <mw-column binding="col1Header"></mw-column>
        <mw-column binding="col2Header"></mw-column>
        <mw-column binding="col3Header"></mw-column>
    </mw-grid>`
})
class MwTestWrapperComponent {
    mockData = ['test1'];
    theme: MwGridTheme;
}

class mockRowFactoryService {
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
        it('should call setGridHeaders and setColWidths', <any>fakeAsync((): void => {
            spyOn(component, 'setGridHeaders');
            spyOn(component, 'setColWidths');
            spyOn(component, 'createRows');
            component.ngAfterViewInit();
            tick();
            expect(component.setGridHeaders).toHaveBeenCalled();
            expect(component.setColWidths).toHaveBeenCalled();
            expect(component.createRows).toHaveBeenCalled();
        }));
    });

    describe('setGridHeaders method', () => {
        it('should populate grid headers from column definitions', () => {
            // Setup
            fixture.detectChanges();

            component.gridHeaders = [];

            // Act
            component.setGridHeaders();

            // Assert
            expect(component.gridHeaders[0].title).toEqual('col1Header');
            expect(component.gridHeaders[1].title).toEqual('col2Header');
            expect(component.gridHeaders[2].title).toEqual('col3Header');
        });
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

        it('should set height on the row', () => {
            component.data = ['item1'];
            component.rowHeight = 30;
            const rowFactoryService = TestBed.get(RowFactoryService);
            spyOn(rowFactoryService, 'createRow').and.returnValue({instance: {
                item: '',
                rowNumber: ''
            }});
            component.createRows();
            expect(component.rows[0].instance.height).toEqual(30);
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
});

describe('MwGridComponent', () => {
    let colDefinition1: MwColumnDirective;
    let colDefinition2: MwColumnDirective;
    let colDefinition3: MwColumnDirective;
    let rowFactoryService: RowFactoryService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ { provide: RowFactoryService, useValue: mockRowFactoryService } ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
        rowFactoryService = TestBed.get(RowFactoryService);
    }));

    beforeEach(() => {
        colDefinition1 = new MwColumnDirective();
        mockColumnDefinitions(colDefinition1);
        colDefinition2 = new MwColumnDirective();
        mockColumnDefinitions(colDefinition2);
        colDefinition3 = new MwColumnDirective();
        mockColumnDefinitions(colDefinition3);

        function mockColumnDefinitions(colDefinition) {
            colDefinition.width = '120';
            colDefinition.binding = 'name';
            colDefinition.minWidth =  10;
            colDefinition.maxWidth = 220;
            spyOn(colDefinition, 'isStarSizedWidth').and.returnValue(false);
            spyOn(colDefinition, 'getStarSizedWidth').and.callFake(() => {
                return Number(colDefinition.width);
            });
            spyOn(colDefinition, 'getMinWidth').and.callFake(() => {
                return `${ colDefinition.minWidth }px`;
            });
            spyOn(colDefinition, 'getMaxWidth').and.callFake(() => {
                return `${ colDefinition.maxWidth }px`;
            });
        }
    });

    describe('setColWidths method', () => {
        it('should set gridHeaders minWidth, maxWidth, and width for each column definition when not starSized', () => {
            // Setup
            let component = new MwGridComponent(rowFactoryService);
            component.gridHeaders = [new MwGridHeader('name'), new MwGridHeader('email')];

            colDefinition1.width = '140';
            colDefinition1.minWidth = 40;
            colDefinition1.maxWidth = 300;

            let contentChildren = new QueryList<MwColumnDirective>();
            contentChildren.reset([colDefinition1, colDefinition2]);
            component.columnDefinitions = contentChildren;

            // Act
            component.setColWidths();

            // Assert
            expect(component.gridHeaders[0].width).toEqual('140px');
            expect(component.gridHeaders[0].minWidth).toEqual('40px');
            expect(component.gridHeaders[0].maxWidth).toEqual('300px');
            expect(component.columnDefinitions.toArray()[0].calculatedWidth).toEqual('140px');

            expect(component.gridHeaders[1].width).toEqual('120px');
            expect(component.gridHeaders[1].minWidth).toEqual('10px');
            expect(component.gridHeaders[1].maxWidth).toEqual('220px');
            expect(component.columnDefinitions.toArray()[1].calculatedWidth).toEqual('120px');
        });

        it('should properly set width for each column definition when starSized', () => {
            // Setup
            let component = new MwGridComponent(rowFactoryService);
            component.gridHeaders = [new MwGridHeader('name'), new MwGridHeader('email')];

            colDefinition1.width = '3';
            colDefinition2.width = '1';

            colDefinition1.isStarSizedWidth = jasmine.createSpy('starSizedSpy1').and.returnValue(true);
            colDefinition2.isStarSizedWidth = jasmine.createSpy('starSizedSpy2').and.returnValue(true);

            let contentChildren = new QueryList<MwColumnDirective>();
            contentChildren.reset([colDefinition1, colDefinition2]);
            component.columnDefinitions = contentChildren;

            // Act
            component.setColWidths();

            // Assert
            expect(component.gridHeaders[0].width).toEqual('75%');
            expect(component.columnDefinitions.toArray()[0].calculatedWidth).toEqual('75%');

            expect(component.gridHeaders[1].width).toEqual('25%');
            expect(component.columnDefinitions.toArray()[1].calculatedWidth).toEqual('25%');
        });
    });
});
