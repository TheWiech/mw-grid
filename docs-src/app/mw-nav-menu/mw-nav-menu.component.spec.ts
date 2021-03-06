import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { MwNavMenuComponent } from './mw-nav-menu.component';

describe('MwNavMenuComponent', () => {
    let component: MwNavMenuComponent;
    let fixture:   ComponentFixture<MwNavMenuComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;
    const mockEvent = new Event('Mock Event');

    beforeEach(async(() => {
        spyOn(mockEvent, 'preventDefault');

        TestBed.configureTestingModule({
        declarations: [
            MwNavMenuComponent,
        ],
        schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwNavMenuComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should create the app', () => {
        expect(fixture).toBeTruthy();
    });

    it(`should set isMenuShown to false`, () => {
        expect(component.isMenuShown).toEqual(false);
    });

    it(`should set windowWidth to be truthy`, () => {
        expect(component.windowWidth).toBeTruthy();
    });

    it(`hideMenu method should set isMenuShown to false`, () => {
        component.isMenuShown = true;
        component.hideMenu();
        expect(component.isMenuShown).toEqual(false);
    });

    it(`showMenu method should set isMenuShown to true`, () => {
        component.isMenuShown = false;
        component.showMenu();
        expect(component.isMenuShown).toEqual(true);
    });

    it('should add menu-shown and overlay-shown classes when isMenuShow = true', () => {
        component.isMenuShown = true;
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.menu-shown')).toBeTruthy();
        expect(de.nativeElement.querySelector('.overlay-shown')).toBeTruthy();
    });

    describe('toggleMenu method', () => {
        it('should event.preventDefault', () => {
            component.toggleMenu(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not update menu visibility when windowWidth > VERTICAL_MENU_BREAKPOINT', () => {
            component.windowWidth = 768;
            spyOn(component, 'hideMenu');
            spyOn(component, 'showMenu');
            component.toggleMenu(mockEvent);
            expect(component.hideMenu).not.toHaveBeenCalled();
            expect(component.showMenu).not.toHaveBeenCalled();
        });

        it('should call hideMenu when menu is shown and window width < VERTICAL_MENU_BREAKPOINT', () => {
            component.windowWidth = 767;
            component.isMenuShown = true;
            spyOn(component, 'hideMenu');
            component.toggleMenu(mockEvent);
            expect(component.hideMenu).toHaveBeenCalled();
        });

        it('should call showMenu when menu is not shown and window width < VERTICAL_MENU_BREAKPOINT', () => {
            component.windowWidth = 767;
            component.isMenuShown = false;
            spyOn(component, 'showMenu');
            component.toggleMenu(mockEvent);
            expect(component.showMenu).toHaveBeenCalled();
        });
    });

    describe('onResize metho', () => {
        it('should set windowWidth to event.target.innerWidth', () => {
            component.windowWidth = 0;
            const mockWindowEvent = { target: { innerWidth: 767 } };
            component.onResize(mockWindowEvent);
            expect(component.windowWidth).toEqual(767);
        });

        it('should call hideMenu when windowWidth > VERTICAL_MENU_BREAKPOINT and isMenuShown = true', () => {
            component.isMenuShown = true;
            const mockWindowEvent = { target: { innerWidth: 768 } };
            spyOn(component, 'hideMenu');
            component.onResize(mockWindowEvent);
            expect(component.hideMenu).toHaveBeenCalled();
        });
    });

    it('should remove menu-shown and overlay-shown classes when isMenuShow = false', () => {
        // First make sure the classes are added before we verify the are removed
        component.isMenuShown = true;
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.menu-shown')).toBeTruthy();
        expect(de.nativeElement.querySelector('.overlay-shown')).toBeTruthy();

        component.isMenuShown = false;
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.menu-shown')).toBeFalsy();
        expect(de.nativeElement.querySelector('.overlay-shown')).toBeFalsy();
    });
});
