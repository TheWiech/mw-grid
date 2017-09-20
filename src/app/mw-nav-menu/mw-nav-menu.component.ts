import { Component, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';

const VERTICAL_MENU_BREAKPOINT = 767;

@Component({
  selector: 'mw-nav-menu',
  templateUrl: './mw-nav-menu.component.html',
  styleUrls: ['./mw-nav-menu.component.scss']
})
export class MwNavMenuComponent {
    isMenuShown = false;
    windowWidth: Number;

    constructor() {
        this.windowWidth = window.innerWidth;
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
