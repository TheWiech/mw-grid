import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MwGridComponent } from './mw-grid/mw-grid.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';
import { MwCellComponent } from './mw-cell/mw-cell.component';
import { MwGridHeadersComponent } from './mw-grid-headers/mw-grid-headers.component';
import { MwGridContentHostDirective } from './mw-grid/mw-grid-content-host.directive';
import { MwRowComponent } from './mw-row/mw-row.component';
import { RowFactoryService } from './row-factory.service';

@NgModule({
    declarations: [
        MwGridComponent,
        MwColumnDirective,
        MwCellComponent,
        MwGridHeadersComponent,
        MwGridContentHostDirective,
        MwRowComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MwGridComponent,
        MwColumnDirective
    ],
    providers: [
        RowFactoryService
    ],
    entryComponents: [
        MwRowComponent
    ]
})
export class MwGridModule { }
