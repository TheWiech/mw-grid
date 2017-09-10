import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwGridHeadersComponent } from './mw-grid-headers.component';

describe('MwGridHeaderComponent', () => {
    let component: MwGridHeadersComponent;
    let fixture: ComponentFixture<MwGridHeadersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwGridHeadersComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwGridHeadersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
