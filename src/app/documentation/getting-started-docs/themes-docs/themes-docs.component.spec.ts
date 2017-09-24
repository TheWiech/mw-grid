import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesDocsComponent } from './themes-docs.component';

describe('ThemesDocsComponent', () => {
  let component: ThemesDocsComponent;
  let fixture: ComponentFixture<ThemesDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemesDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemesDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
