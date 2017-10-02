import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MwColumnDocsComponent } from './mw-column-docs.component';

describe('MwColumnDocsComponent', () => {
  let component: MwColumnDocsComponent;
  let fixture: ComponentFixture<MwColumnDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MwColumnDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MwColumnDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
