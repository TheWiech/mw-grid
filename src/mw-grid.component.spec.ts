import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwGridComponent } from './mw-grid.component';

describe('MwGridComponent', () => {
  let component: MwGridComponent;
  let fixture: ComponentFixture<MwGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MwGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MwGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
