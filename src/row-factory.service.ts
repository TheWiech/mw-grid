import {
    Injectable,
    ComponentFactoryResolver,
    ReflectiveInjector,
    ViewContainerRef,
    QueryList,
    ComponentRef
} from '@angular/core';
import { MwRowComponent } from './mw-row/mw-row.component';
import { MwGridHeader } from './mw-grid-headers/mw-grid-headers.component';
import { MwGridComponent } from './mw-grid/mw-grid.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';

@Injectable()
export class RowFactoryService {

    rowHeight: Number = 55;

    constructor(private resolver: ComponentFactoryResolver) {
    }

    createRow(viewRef: ViewContainerRef, grid: MwGridComponent, item: any): ComponentRef<MwRowComponent> {
        const componentFactory = this.resolver.resolveComponentFactory(MwRowComponent);
        const row = viewRef.createComponent(componentFactory);
        row.instance.height = this.rowHeight;
        row.instance.item = item;
        row.instance.grid = grid;
        return row;
    }
}
