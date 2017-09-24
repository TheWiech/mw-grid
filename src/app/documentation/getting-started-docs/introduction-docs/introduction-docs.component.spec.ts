import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionDocsComponent } from './introduction-docs.component';

describe('IntroductionDocsComponent', () => {
  let component: IntroductionDocsComponent;
  let fixture: ComponentFixture<IntroductionDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroductionDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductionDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
