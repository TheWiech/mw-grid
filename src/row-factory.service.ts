import {
    Injectable,
    ComponentFactoryResolver,
    ReflectiveInjector,
    ViewContainerRef,
    QueryList,
    ComponentRef
} from '@angular/core';
import { MwRowComponent } from './mw-row/mw-row.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';

@Injectable()
export class RowFactoryService {

    constructor(private resolver: ComponentFactoryResolver) {
    }

    createRow(viewRef: ViewContainerRef, columnDefinitions: QueryList<MwColumnDirective>): ComponentRef<MwRowComponent> {
        const componentFactory = this.resolver.resolveComponentFactory(MwRowComponent);
        const row = viewRef.createComponent(componentFactory);
        (<MwRowComponent>row.instance).columnDefinitions = columnDefinitions;
        return row;
    }
}
