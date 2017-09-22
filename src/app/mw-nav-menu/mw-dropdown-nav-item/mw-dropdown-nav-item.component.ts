import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'mw-dropdown-nav-item',
    templateUrl: './mw-dropdown-nav-item.component.html',
    styleUrls: ['./mw-dropdown-nav-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MwDropdownNavItemComponent {
    @Output() menuItemClick = new EventEmitter();

    constructor() { }

    onMenuItemClick(event: Event) {
        event.preventDefault();

        this.menuItemClick.emit('MenuItemClicked');
    }
}
