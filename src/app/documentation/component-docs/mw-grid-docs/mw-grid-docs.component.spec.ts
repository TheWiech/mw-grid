import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwGridDocsComponent } from './mw-grid-docs.component';

describe('MwGridDocsComponent', () => {
  let component: MwGridDocsComponent;
  let fixture: ComponentFixture<MwGridDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MwGridDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MwGridDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
