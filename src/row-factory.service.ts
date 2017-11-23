import {
    Injectable,
    ComponentFactoryResolver,
    ReflectiveInjector,
    ViewContainerRef,
    QueryList,
    ComponentRef
} from '@angular/core';
import { MwRowComponent, RowType } from './mw-row/mw-row.component';
import { MwGridComponent } from './mw-grid/mw-grid.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';

@Injectable()
export class RowFactoryService {

    columnHeaderHeight = 25;
    rowHeight = 55;

    constructor(private resolver: ComponentFactoryResolver) { }

    createRow(viewRef: ViewContainerRef, grid: MwGridComponent, item: any): ComponentRef<MwRowComponent> {
        const row = this.initRow(viewRef, grid);
        row.instance.height = this.rowHeight;
        row.instance.item = item;
        row.instance.rowType = RowType.Content;

        row.location.nativeElement.style.position = 'absolute';
        row.location.nativeElement.style.width = '100%';

        return row;
    }

    createColumnHeaders(viewRef: ViewContainerRef, grid: MwGridComponent): ComponentRef<MwRowComponent> {
        const row = this.initRow(viewRef, grid);

        const item = {};
        grid.columnDefinitions.forEach(element => {
            item[element.binding] = element.binding;
        });

        row.instance.item = item;
        row.instance.height = this.columnHeaderHeight;
        row.instance.rowType = RowType.ColumnHeader;
        row.location.nativeElement.style.width = '100%';

        return row;
    }

    private initRow(viewRef: ViewContainerRef, grid: MwGridComponent) {
        const componentFactory = this.resolver.resolveComponentFactory(MwRowComponent);
        const row = viewRef.createComponent(componentFactory);

        row.instance.grid = grid;

        return row;
    }
}
