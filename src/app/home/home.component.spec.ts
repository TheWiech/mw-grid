import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { HomeComponent } from './home.component';

@Component({selector: 'mw-grid', template: ''})
export class MwGrid {
    @Input() data: Array<any>;
}

@Component({selector: 'mw-column', template: ''})
export class MwColumn {
    @Input() binding: String;
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            HomeComponent,
            MwGrid,
            MwColumn
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
