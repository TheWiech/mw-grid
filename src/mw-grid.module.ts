import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MwGridComponent } from './mw-grid/mw-grid.component';
import { MwColumnDirective } from './mw-column/mw-column.directive';
import { MwCellComponent } from './mw-cell/mw-cell.component';
import { MwGridHeadersComponent } from './mw-grid-headers/mw-grid-headers.component';

@NgModule({
    declarations: [
        MwGridComponent,
        MwColumnDirective,
        MwCellComponent,
        MwGridHeadersComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MwGridComponent,
        MwColumnDirective,
        MwCellComponent,
        MwGridHeadersComponent
    ]
})
export class MwGridModule { }
