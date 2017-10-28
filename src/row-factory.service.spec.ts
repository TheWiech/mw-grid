import { TestBed, inject } from '@angular/core/testing';
import { ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { RowFactoryService } from './row-factory.service';
import { MwGridComponent } from './mw-grid/mw-grid.component';

class MwGridMock extends MwGridComponent { }
class ComponentFactoryResolverMock {
    resolveComponentFactory(component: any) { }
}
class ViewContainerRefMock {
    createComponent() {
        return {
            instance: {}
        }
    };
}

describe('RowFactoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RowFactoryService,
                { provide: ComponentFactoryResolver, useClass: ComponentFactoryResolverMock },
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        });
    });

    it('should be created', inject([RowFactoryService], (service: RowFactoryService) => {
        expect(service).toBeTruthy();
    }));

    describe('rowFactorService', () => {
        it('should set height, item, and grid on row.instance', inject([RowFactoryService, ViewContainerRef], (service: RowFactoryService, mockViewRef: ViewContainerRef) => {
            const mockGrid = new MwGridMock(service);
            const mockItem = { name: 'Matthew Wiechec' };
            const result = service.createRow(mockViewRef, mockGrid, mockItem);

            expect(result.instance.height).toEqual(55);
            expect(result.instance.item).toEqual(mockItem);
            expect(result.instance.grid).toEqual(mockGrid);
        }));
    });
});
