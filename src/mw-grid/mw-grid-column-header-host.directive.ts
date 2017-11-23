import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[mw-grid-column-headers-host]'
})
export class MwGridColumnHeaderHostDirective {

    /**
     * This directive exposes viewContainerRef so it can act as an anchor directive.
     */
    constructor(public viewContainerRef: ViewContainerRef) { }
}
