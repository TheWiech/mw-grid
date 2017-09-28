import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwBindingDocComponent } from './mw-binding-doc.component';

describe('MwBindingDocComponent', () => {
    let component: MwBindingDocComponent;
    let fixture: ComponentFixture<MwBindingDocComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwBindingDocComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwBindingDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
