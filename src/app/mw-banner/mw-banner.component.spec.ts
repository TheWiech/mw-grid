import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { MwBannerComponent } from './mw-banner.component';

describe('MwBannerComponent', () => {
    let component: MwBannerComponent;
    let fixture:   ComponentFixture<MwBannerComponent>;
    let de:        DebugElement;
    let el:        HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ MwBannerComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MwBannerComponent);
        component = <MwBannerComponent>fixture.debugElement.children[0].componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should only display primary banner with primaryText when primaryText is set', () => {
        component.primaryText = 'Hello World!';
        component.secondaryText = undefined;
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.primary-text')).toBeDefined();
        expect(de.nativeElement.querySelector('.primary-text').innerHTML.trim()).toEqual('Hello World!');
        expect(de.nativeElement.querySelector('.secondary-text')).toEqual(null);
    });

    it('should only display secondary banner with secondaryText when secondaryText is set', () => {
        component.secondaryText = 'Hello World!';
        component.primaryText = undefined;
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.primary-text')).toEqual(null);
        expect(de.nativeElement.querySelector('.secondary-text')).toBeDefined();
        expect(de.nativeElement.querySelector('.secondary-text').innerHTML.trim()).toEqual('Hello World!');
    });

    it('should display primary and secondary banner when primaryText and secondaryText are set', () => {
        component.primaryText = 'primary text';
        component.secondaryText = 'Hello World!';
        fixture.detectChanges();
        expect(de.nativeElement.querySelector('.primary-text')).toBeDefined();
        expect(de.nativeElement.querySelector('.secondary-text')).toBeDefined();
    });

    describe('ngOnInit method', () => {
        it('should set bannerMargin = 2.5em when applyMargin is undefined', () => {
            component.applyMargin = undefined;
            component.ngOnInit();
            expect(component.bannerMargin).toEqual('2.5em');
        });

        it('should set bannerMargin = 2.5em when applyMargin is true', () => {
            component.applyMargin = true;
            component.ngOnInit();
            expect(component.bannerMargin).toEqual('2.5em');
        });

        it('should set bannerMargin = 0 when applyMargin is false', () => {
            component.applyMargin = false;
            component.ngOnInit();
            expect(component.bannerMargin).toEqual('0');
        });
    })
});
