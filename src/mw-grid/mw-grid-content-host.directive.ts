import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[mw-grid-content-host]'
})
export class MwGridContentHostDirective {

    /**
     * This directive exposes viewContainerRef so it can act as an anchor directive.
     */
    constructor(public viewContainerRef: ViewContainerRef) { }
}
