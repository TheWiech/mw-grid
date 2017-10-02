import { Component, OnInit } from '@angular/core';

import { MwGridTheme } from '../../../src/mw-grid/mw-grid.component';

@Component({
  selector: 'mw-grid-example',
  templateUrl: './grid-example.component.html',
  styleUrls: ['./grid-example.component.scss']
})
export class GridExampleComponent implements OnInit {
    users: Array<any>;
    theme: MwGridTheme = MwGridTheme.Modern;

    constructor() {
        this.users = [
            {name: 'Matthew Wiechec', username: 'wiechec.matthew', email: 'thewiech@gmail.com', phoneNumber: '111-111-1111'},
            {name: 'Barbara Cunningham', username: 'cunningham.barbara', email: 'thewiech@gmail.com', phoneNumber: '222-222-2222'},
            {name: 'Tia Green', username: 'green.tia', email: 'thewiech@gmail.com', phoneNumber: '333-333-3333'},
            {name: 'John Carter', username: 'carter.john', email: 'thewiech@gmail.com', phoneNumber: '111-222-3333'},
            {name: 'Laura Jones', username: 'jones.laura', email: 'thewiech@gmail.com', phoneNumber: '222-333-4444'},
            {name: 'Brian Webb', username: 'webb.brian', email: 'thewiech@gmail.com', phoneNumber: '555-222-9999'},
            {name: 'Nancy Meyer', username: 'meyer.nancy', email: 'thewiech@gmail.com', phoneNumber: '123-123-1234'},
            {name: 'Marian Higgin', username: 'higgin.marian', email: 'thewiech@gmail.com', phoneNumber: '123-456-7890'},
            {name: 'Kerri Gotcher', username: 'gotcher.kerri', email: 'thewiech@gmail.com', phoneNumber: '543-221-1212'},
        ];
    }

    ngOnInit() {
    }

}
