import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mw-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements AfterViewInit {
    @ViewChild('docNavMenu') docsNavMenu: ElementRef;
    docsNavMenuHeight: String;
    navDistanceFromTop: Number;
    showMobileNav: Boolean;
    showDocsNav: Boolean;
    currentNavLocation: String;

    constructor (private router: Router) {
        this.showDocsNav = window.innerWidth >= 768 ? true : false;

        router.events.subscribe((newRoute) => {
            this.currentNavLocation = router.url.split('/').pop();
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.getMenuDistanceFromTop();
            this.setMenuDimensions();
            this.positionScrollMenu(this.navDistanceFromTop, window.document.scrollingElement.scrollTop);
        });
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        this.setMenuDimensions();
        this.positionScrollMenu(this.navDistanceFromTop, window.document.scrollingElement.scrollTop);
    }

    @HostListener('window:scroll', ['$event']) onScroll(event) {
        !this.navDistanceFromTop ? this.getMenuDistanceFromTop() :
                this.positionScrollMenu(this.navDistanceFromTop, event.srcElement.scrollingElement.scrollTop);
    }

    positionScrollMenu(menuDistanceFromTop: Number, distanceScrolled: Number) {
        if (!this.showMobileNav && distanceScrolled > menuDistanceFromTop) {
            this.docsNavMenu.nativeElement.style.position = 'fixed';
            this.docsNavMenu.nativeElement.style.top = '0';
        } else {
            this.docsNavMenu.nativeElement.style.position = '';
            this.docsNavMenu.nativeElement.style.top = '';
        }
    }

    getMenuDistanceFromTop() {
        if (!this.showDocsNav) {
            return;
        }
        this.navDistanceFromTop = this.docsNavMenu.nativeElement.getBoundingClientRect().top +
                window.document.scrollingElement.scrollTop;
    }

    setMenuDimensions() {
        if ((this.showDocsNav && window.innerWidth < 768) || (!this.showDocsNav && window.innerWidth >= 768)) {
            this.toggleDocNav();
        }

        this.showMobileNav = window.innerWidth < 768 ? true : false;
        this.docsNavMenuHeight = window.innerWidth >= 768 ? `${ window.innerHeight - 10 }px` : '';
    }

    toggleDocNav() {
        this.showDocsNav = window.innerWidth >= 768 ? true : !this.showDocsNav;
        this.docsNavMenu.nativeElement.style.minHeight = this.showDocsNav === true ? 'initial' : '';
    }
}
