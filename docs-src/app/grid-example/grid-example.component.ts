import { Component, ViewEncapsulation } from '@angular/core';

import { MwGridTheme } from '../../../src/mw-grid/mw-grid.component';

@Component({
  selector: 'mw-grid-example',
  templateUrl: './grid-example.component.html',
  styleUrls: ['./grid-example.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridExampleComponent {
    users: Array<any>;
    theme: MwGridTheme = MwGridTheme.Modern;

    mockUsers = [{
        name: 'Matthew Wiechec',
        title: 'Software Engineer',
        username: 'wiechec.matthew',
        email: 'thewiech@gmail.com',
        phoneNumber: '111-111-1111',
        selected: false
    }, {
        name: 'Barbara Cunningham',
        title: 'Architect',
        username: 'cunningham.barbara',
        email: 'thewiech@gmail.com',
        phoneNumber: '222-222-2222',
        selected: false
    }, {
        name: 'Tia Green',
        title: 'Analyst',
        username: 'green.tia',
        email: 'thewiech@gmail.com',
        phoneNumber: '333-333-3333',
        selected: false
    }, {
        name: 'John Carter',
        title: 'Sr. Software Engineer',
        username: 'carter.john',
        email: 'thewiech@gmail.com',
        phoneNumber: '111-222-3333',
        selected: false
    }];

    constructor() {
        let i = 0;
        this.users = Array.from({length: 10000}).map(item => {
            i++;
            // Need to make deep copy for checkboxes to work in grid
            return Object.assign({}, this.mockUsers[i % 4]);
        });
    }

    onCheckboxClicked(item) {
        item.selected = !item.selected;
    }
}
