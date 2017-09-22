import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwDropdownNavItemComponent } from './mw-dropdown-nav-item.component';

describe('MwDropdownNavItemComponent', () => {
    let component: MwDropdownNavItemComponent;
    let fixture: ComponentFixture<MwDropdownNavItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ MwDropdownNavItemComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwDropdownNavItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
