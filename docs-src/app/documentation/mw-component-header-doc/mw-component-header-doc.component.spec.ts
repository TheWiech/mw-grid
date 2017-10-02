import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MwComponentHeaderDocsComponent } from './mw-component-header-doc.component';

describe('MwComponentHeaderDocsComponent', () => {
    let component: MwComponentHeaderDocsComponent;
    let fixture: ComponentFixture<MwComponentHeaderDocsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwComponentHeaderDocsComponent ],
        schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwComponentHeaderDocsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
