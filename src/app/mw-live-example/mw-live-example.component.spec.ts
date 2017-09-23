import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MwLiveExampleComponent } from './mw-live-example.component';

describe('MwLiveExampleComponent', () => {
    let component: MwLiveExampleComponent;
    let fixture: ComponentFixture<MwLiveExampleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwLiveExampleComponent ],
        schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwLiveExampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
