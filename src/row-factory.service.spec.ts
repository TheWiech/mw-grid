import { TestBed, inject } from '@angular/core/testing';
import { ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef, QueryList} from '@angular/core';
import { RowFactoryService } from './row-factory.service';
import { MwGridComponent } from './mw-grid/mw-grid.component';
import { RowType } from './mw-row/mw-row.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';

class MwGridMock extends MwGridComponent { }
class ComponentFactoryResolverMock {
    resolveComponentFactory(component: any) { }
}
class ViewContainerRefMock {
    createComponent() {
        return {
            instance: {},
            location: {
                nativeElement: {
                    style: {}
                }
            }
        }
    };
}

describe('RowFactoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RowFactoryService,
                { provide: ComponentFactoryResolver, useClass: ComponentFactoryResolverMock },
                { provide: ViewContainerRef, useClass: ViewContainerRefMock },
                { provide: ChangeDetectorRef, useClass: ChangeDetectorRef }
            ]
        });
    });

    it('should be created', inject([RowFactoryService], (service: RowFactoryService) => {
        expect(service).toBeTruthy();
    }));

    describe('rowFactorService', () => {
        it('should set height, item, grid, and rowType on row.instance when creating standard row', inject([RowFactoryService, ViewContainerRef, ChangeDetectorRef], (service: RowFactoryService, mockViewRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef) => {
            const mockGrid = new MwGridMock(service, changeDetectorRef);
            const mockItem = { name: 'Matthew Wiechec' };
            const result = service.createRow(mockViewRef, mockGrid, mockItem);

            expect(result.instance.height).toEqual(service.rowHeight);
            expect(result.instance.item).toEqual(mockItem);
            expect(result.instance.grid).toEqual(mockGrid);
            expect(result.instance.rowType).toEqual(RowType.Content);
        }));

        it('should set height, item, grid, and rowType on row.instance when creating column headers', inject([RowFactoryService, ViewContainerRef, ChangeDetectorRef], (service: RowFactoryService, mockViewRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef) => {
            const mockGrid = new MwGridMock(service, changeDetectorRef);
            service.columnHeaderHeight = 50;

            const column1 = new MwColumnDirective();
            column1.binding = 'col1';
            const column2 = new MwColumnDirective();
            column2.binding = 'col2';

            mockGrid.columnDefinitions = new QueryList<MwColumnDirective>();
            mockGrid.columnDefinitions.reset([column1, column2]);

            const result = service.createColumnHeaders(mockViewRef, mockGrid);

            expect(result.instance.height).toEqual(service.columnHeaderHeight);
            expect(result.instance.item).toEqual({ col1: 'col1', col2: 'col2'});
            expect(result.instance.grid).toEqual(mockGrid);
            expect(result.instance.rowType).toEqual(RowType.ColumnHeader);
        }));
    });
});
