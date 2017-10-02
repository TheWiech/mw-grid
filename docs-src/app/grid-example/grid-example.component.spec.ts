import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { GridExampleComponent } from './grid-example.component';
import { MwGridTheme } from '../../../src/mw-grid/mw-grid.component';

@Component({selector: 'mw-grid', template: ''})
export class MwGridComponent {
    @Input() data: Array<any>;
    @Input() theme: MwGridTheme;
}

@Component({selector: 'mw-column', template: ''})
export class MwColumnComponent {
    @Input() binding: String;
    @Input() width: String;
    @Input() minWidth: Number;
    @Input() maxWidth: Number;
}

describe('GridExampleComponent', () => {
    let component: GridExampleComponent;
    let fixture: ComponentFixture<GridExampleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            GridExampleComponent,
            MwGridComponent,
            MwColumnComponent
        ]})
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridExampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
