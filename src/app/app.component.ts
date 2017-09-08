import { Component, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';

const VERTICAL_MENU_BREAKPOINT = 767;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isMenuShown = false;
    windowWidth: Number;
    shouldShowConstructionBanner = true;

    constructor() {
        this.windowWidth = window.screen.width;
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        this.windowWidth = event.target.innerWidth;

        if (this.windowWidth > VERTICAL_MENU_BREAKPOINT && this.isMenuShown) {
            this.hideMenu();
        }
    };

    toggleMenu(event: Event) {
        event.preventDefault();
        if (this.windowWidth > VERTICAL_MENU_BREAKPOINT) {
            return;
        }
        if (this.isMenuShown) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    hideMenu() {
        this.isMenuShown = false;
    }

    showMenu() {
        this.isMenuShown = true;
    }
}
