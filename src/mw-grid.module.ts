import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MwGridComponent } from './mw-grid/mw-grid.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';
import { MwCellComponent } from './mw-cell/mw-cell.component';
import { MwGridContentHostDirective } from './mw-grid/mw-grid-content-host.directive';
import { MwGridColumnHeaderHostDirective } from './mw-grid/mw-grid-column-header-host.directive';
import { MwRowComponent } from './mw-row/mw-row.component';
import { RowFactoryService } from './row-factory.service';
import { MwPaginationControlComponent } from './mw-pagination-control/mw-pagination-control.component';

@NgModule({
    declarations: [
        MwGridComponent,
        MwColumnDirective,
        MwCellComponent,
        MwGridContentHostDirective,
        MwGridColumnHeaderHostDirective,
        MwRowComponent,
        MwPaginationControlComponent
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
