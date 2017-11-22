import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

import { GridExampleComponent } from './grid-example.component';
import { MwGridTheme } from '../../../src/mw-grid/mw-grid.component';

describe('GridExampleComponent', () => {
    let component: GridExampleComponent;
    let fixture: ComponentFixture<GridExampleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GridExampleComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
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
