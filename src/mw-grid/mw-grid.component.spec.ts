import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component, DebugElement, Input, QueryList, NO_ERRORS_SCHEMA, ComponentFactoryResolver } from '@angular/core';

import { MwGridComponent, MwGridTheme } from './mw-grid.component';
import { MwColumnDirective } from '../mw-column/mw-column.directive';
import { MwRowComponent } from '../mw-row/mw-row.component';
import { RowFactoryService } from '../row-factory.service';
import { MwGridContentHostDirective } from './mw-grid-content-host.directive';
import { MwGridColumnHeaderHostDirective } from './mw-grid-column-header-host.directive';

@Component({
    selector: 'mw-test-wrapper',
    template: `<mw-grid [data]=mockData [theme]=theme [useInfiniteScroll]="useInfiniteScroll" [rowsPerPage]="5">
        <mw-column width="1*" binding="col1Header"></mw-column>
        <mw-column width="3*" binding="col2Header"></mw-column>
        <mw-column binding="col3Header"></mw-column>
    </mw-grid>`
})
class MwTestWrapperComponent {
    mockData = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10', 'item11', 'item12'];
    theme: MwGridTheme;
    useInfiniteScroll = true;
}

const destroySpy = jasmine.createSpy('destroy');
class MockRowFactoryService {
    rowHeight: number;
    columnHeaderHeight: number;

    createRow = () => {
        return {
            instance: {},
            location: {
                nativeElement: {
                    style: {}
                }
            },
            destroy: destroySpy
        };
    }

    createColumnHeaders = () => {
        return {
            instance: {},
            location: {
                nativeElement: {
                    style: {}
                }
            },
            destroy: destroySpy
        };
    }
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
            MwGridContentHostDirective,
            MwGridColumnHeaderHostDirective,
            MwRowComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
              entryComponents: [MwRowComponent]
            }
        }).overrideComponent(MwGridComponent, {
            set: {
                providers: [ { provide: RowFactoryService, useClass: MockRowFactoryService } ]
            }
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
        it('should call setGridTheme and set totalPages', () => {
            fixture.detectChanges();
            spyOn(component, 'setGridTheme');
            component.ngOnInit();
            expect(component.setGridTheme).toHaveBeenCalled();
            expect(component.totalPages).toEqual(3);
        });

        it('should set usePagination = false when useInfiniteScroll = true', () => {
            fixture.detectChanges();
            spyOn(component, 'setGridTheme');
            component.ngOnInit();
            expect(component.usePagination).toEqual(false);
        });

        it('should set useInifiniteScroll = false when usePagination = true', () => {
            fixture.detectChanges();
            component.useInfiniteScroll = false;
            component.usePagination = true;
            spyOn(component, 'setGridTheme');
            component.ngOnInit();
            expect(component.usePagination).toEqual(true);
        });

        it('should set useInifiniteScroll = true and usePagination = false when both are true', () => {
            fixture.detectChanges();
            component.useInfiniteScroll = true;
            component.usePagination = true;
            spyOn(component, 'setGridTheme');
            component.ngOnInit();
            expect(component.usePagination).toEqual(false);
            expect(component.useInfiniteScroll).toEqual(true);
        });
    });

    describe('ngAfterViewInit', () => {
        it('should set grid on each column definition', <any>fakeAsync((): void => {
            fixture.detectChanges();
            tick();
            var colDefinitions = component.columnDefinitions.toArray();

            expect(colDefinitions[0].grid).toEqual(component);
            expect(colDefinitions[1].grid).toEqual(component);
            expect(colDefinitions[2].grid).toEqual(component);
        }));

        it('should calculate starSizeTotalWidth', <any>fakeAsync((): void => {
            component.starSizeTotalWidth = 0;
            fixture.detectChanges();
            tick();
            expect(component.starSizeTotalWidth).toEqual(4);
        }));

        it('should set rowHeight of rowFactory', <any>fakeAsync((): void => {
            const rowFactoryMock = component._rowFactory;
            rowFactoryMock.rowHeight = 10;
            component.rowHeight = 20;
            fixture.detectChanges();
            tick();
            expect(rowFactoryMock.rowHeight).toEqual(20);
        }));

        it('should set the height of the grid to the height of rows when using infinite scroll', <any>fakeAsync((): void => {
            const gridHeaderHeight = 25;
            component.rowHeight = 60;
            fixture.detectChanges();
            tick();
            expect(component.gridContent.nativeElement.style.height).toEqual(`${ component.rowHeight * component.data.length + gridHeaderHeight }px`);
        }));

        it('should set the height of the grid to the height of 1 page of rows when using pagination', <any>fakeAsync((): void => {
            const gridHeaderHeight = 25;
            component.rowHeight = 60;
            fixture.componentInstance.useInfiniteScroll = false;
            fixture.detectChanges();
            tick();
            expect(component.gridContent.nativeElement.style.height).toEqual(`${ component.rowHeight * component.rowsPerPage + gridHeaderHeight }px`);
        }));

        it('should load 2.5 pages of rows when using infiniteScroll', <any>fakeAsync((): void => {
            component.rowHeight = 60;
            component.gridContainer.nativeElement.style.height = '180px';

            const rowFactoryMock = component._rowFactory;
            spyOn(rowFactoryMock, 'createRow').and.callThrough();

            fixture.detectChanges();
            tick();
            expect(rowFactoryMock.createRow).toHaveBeenCalledTimes(8);
        }));

        it('should load 1 page of rows when usePagination = true', <any>fakeAsync((): void => {
            component.rowHeight = 60;
            fixture.componentInstance.useInfiniteScroll = false;
            component.gridContainer.nativeElement.style.height = '180px';

            const rowFactoryMock = component._rowFactory;
            spyOn(rowFactoryMock, 'createRow').and.callThrough();

            fixture.detectChanges();
            tick();
            expect(rowFactoryMock.createRow).toHaveBeenCalledTimes(5);
        }));
    });

    describe('when grid scrolled', () => {
        let mockEvent = {
            target: {
                scrollTop: 0,
                offsetHeight: 180
            }
        };

        beforeEach(() => {
            mockEvent = {
                target: {
                    scrollTop: 0,
                    offsetHeight: 180
                }
            };
            component.rowHeight = 60;
            component.gridContainer.nativeElement.style.height = '180px';
            destroySpy.calls.reset();
        });

        describe('down', () => {
            it('should not add row if 1 page of rows below have already been prefetched', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                const rowFactoryMock = component._rowFactory;
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                mockEvent.target.scrollTop = 60;
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).not.toHaveBeenCalled();
            }));

            it('should add row when less than 1 page of rows below have been prefetched and should delete a row on top', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                const rowFactoryMock = component._rowFactory
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                mockEvent.target.scrollTop = 180;
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).toHaveBeenCalledTimes(1);
            }));

            it('should add 3 rows when scrolled far enough that 3 rows are needed for 1 page to be prefetched', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                const rowFactoryMock = component._rowFactory;
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                mockEvent.target.scrollTop = 300;
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).toHaveBeenCalledTimes(3);
            }));

            it('should not add rows when the last row is already loaded', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 660; // Scroll so last row is not visible
                component.onGridScroll(mockEvent);

                const rowFactoryMock = component._rowFactory;
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                mockEvent.target.scrollTop = 720; // Scroll to bottom
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).not.toHaveBeenCalled();
            }));

            it('should not delete rows on top if 1 page of rows are not prefetched', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 180; // Scroll so 1 page of rows are above grid
                component.onGridScroll(mockEvent);

                // Assert
                expect(destroySpy).not.toHaveBeenCalled();
            }));

            it('should delete rows on top if 1 page of rows are prefetched', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 240; // Scroll so more than 1 page of rows are above grid
                component.onGridScroll(mockEvent);

                // Assert
                expect(destroySpy).toHaveBeenCalledTimes(1);
            }));
        });

        describe('up', () => {
            it('should add rows so 1 page of rows are prefetched on the top', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 360;
                // Scroll down to trigger bottom rows being loaded and top rows being deleted.
                component.onGridScroll(mockEvent);


                const rowFactoryMock = component._rowFactory;
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                // Scroll up 2 rows to trigger 1 page of rows to be prefetched
                mockEvent.target.scrollTop = 265;
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).toHaveBeenCalledTimes(2);
            }));

            it('should not add rows when the first row is already loaded', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 120;
                // Scroll down to trigger bottom rows being loaded and top rows being deleted.
                component.onGridScroll(mockEvent);

                const rowFactoryMock = component._rowFactory;
                spyOn(rowFactoryMock, 'createRow').and.callThrough();

                mockEvent.target.scrollTop = 60; // Scroll up 1 row
                // Action
                component.onGridScroll(mockEvent);

                // Assert
                expect(rowFactoryMock.createRow).not.toHaveBeenCalled();
            }));

            it('should delete rows on bottom if 1 page of rows are prefetched', <any>fakeAsync((): void => {
                // Setup
                fixture.detectChanges();
                tick();

                mockEvent.target.scrollTop = 240; // Scroll so more than 1 page of rows are above grid
                component.onGridScroll(mockEvent);
                destroySpy.calls.reset();

                mockEvent.target.scrollTop = 180;
                component.onGridScroll(mockEvent);

                // Assert
                expect(destroySpy).toHaveBeenCalledTimes(1);
            }));
        });
    });

    describe('loadPage', () => {
        it('should load new page and remove old rows', () => {
            fixture.detectChanges();

            const rowFactoryMock = component._rowFactory;
            const createRowSpy = spyOn(rowFactoryMock, 'createRow').and.callThrough();

            component.loadPage(1);
            destroySpy.calls.reset();
            createRowSpy.calls.reset();
            component.loadPage(2);

            expect(destroySpy).toHaveBeenCalledTimes(5);
            expect(createRowSpy).toHaveBeenCalledTimes(5);
        });

        it('should not load new page if page is greater than total pages', () => {
            fixture.detectChanges();
            destroySpy.calls.reset();

            const rowFactoryMock = component._rowFactory;
            spyOn(rowFactoryMock, 'createRow').and.callThrough();

            component.loadPage(4);

            expect(destroySpy).not.toHaveBeenCalled();
            expect(rowFactoryMock.createRow).not.toHaveBeenCalled();
        });

        it('should not load new page if page is 0', () => {
            fixture.detectChanges();
            destroySpy.calls.reset();

            const rowFactoryMock = component._rowFactory;
            spyOn(rowFactoryMock, 'createRow').and.callThrough();

            component.loadPage(0);

            expect(destroySpy).not.toHaveBeenCalled();
            expect(rowFactoryMock.createRow).not.toHaveBeenCalled();
        });
    });
});
