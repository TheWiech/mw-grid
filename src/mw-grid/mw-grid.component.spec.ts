import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, DebugElement, Input, QueryList } from '@angular/core';

import { MwGridComponent, MwGridTheme } from './mw-grid.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';

@Component({selector: 'mw-cell', template: '<div class="mock-mw-cell"></div>'})
export class MwCell { }

@Component({selector: 'mw-grid-headers', template: '<div class="mock-grid-headers"></div>'})
class MwGridHeader {
    constructor (public title: string) { }

    width: String;
    minWidth: String;
    maxWidth: String;
}

@Component({
    selector: 'mw-grid-headers',
    template: '<div class="mock-grid-headers"></div>',
})
export class MwGridHeaders {
    @Input() headers: Array<MwGridHeader>;
}

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
            MwColumnDirective,
            MwGridHeaders
        ]}).compileComponents();
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

    describe('ngAfterViewInit method', () => {
        it('should call setGridHeaders and setColWidths', <any>fakeAsync((): void => {
            spyOn(component, 'setGridHeaders');
            spyOn(component, 'setColWidths');
            component.ngAfterViewInit();
            tick();
            expect(component.setGridHeaders).toHaveBeenCalled();
            expect(component.setColWidths).toHaveBeenCalled();
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
});

describe('MwGridComponent', () => {
    let colDefinition1: MwColumnDirective;
    let colDefinition2: MwColumnDirective;
    let colDefinition3: MwColumnDirective;

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
            let component = new MwGridComponent();
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
            let component = new MwGridComponent();
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
