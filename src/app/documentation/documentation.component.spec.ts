import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentationComponent } from './documentation.component';

@Component({selector: 'grid-example', template: ''})
export class GridExampleComponent {
}

let mockRouter = {
    events: {
        subscribe: jasmine.createSpy('subscribe')
    }
};

describe('DocumentationComponent', () => {
    let component: DocumentationComponent;
    let fixture: ComponentFixture<DocumentationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            DocumentationComponent,
            GridExampleComponent
        ],
        providers: [ { provide: Router, useValue: mockRouter } ],
        schemas: [NO_ERRORS_SCHEMA]})
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocumentationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
