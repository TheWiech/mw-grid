import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements AfterViewInit {
    @ViewChild('docNavMenu') docsNavMenu: ElementRef;
    docsNavMenuHeight: Number;
    navDistanceFromTop: Number;

    constructor() {
        this.docsNavMenuHeight = window.innerHeight - 10;
    }

    ngAfterViewInit() {
        this.navDistanceFromTop = this.docsNavMenu.nativeElement.getBoundingClientRect().top + window.document.body.scrollTop;
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        this.docsNavMenuHeight = event.target.innerHeight - 10;
    };

    @HostListener('window:scroll', ['$event']) onScroll(event) {
        if (event.srcElement.scrollingElement.scrollTop > this.navDistanceFromTop) {
            this.docsNavMenu.nativeElement.style.position = 'fixed';
            this.docsNavMenu.nativeElement.style.top = '0';
        } else {
            this.docsNavMenu.nativeElement.style.position = 'absolute';
            this.docsNavMenu.nativeElement.style.top = '';
        }
    };
}
