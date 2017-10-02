import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwButtonComponent } from './mw-button.component';

describe('MwButtonComponent', () => {
    let component: MwButtonComponent;
    let fixture: ComponentFixture<MwButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwButtonComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
