import { Directive, OnInit, Input } from '@angular/core';

@Directive({
    selector: 'mw-column'
})
export class MwColumnDirective implements OnInit {
    @Input() binding: String;

    constructor() { }

    ngOnInit() {
    }
}
