import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwUserIconComponent } from './mw-user-icon.component';

describe('UserIconComponent', () => {
    let component: MwUserIconComponent;
    let fixture: ComponentFixture<MwUserIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ MwUserIconComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwUserIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
