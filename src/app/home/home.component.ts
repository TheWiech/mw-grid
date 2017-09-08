import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    users: Array<any>;

    constructor() {
        this.users = [
            {name: 'Matthew Wiechec', email: 'testemail1'},
            {name: 'John Doe', email: 'testemail2'},
            {name: 'Jane Doe', email: 'testemail3'},
            {name: 'Matthew Wiechec', email: 'testemail1'},
            {name: 'John Doe', email: 'testemail2'},
            {name: 'Jane Doe', email: 'testemail3'},
            {name: 'Matthew Wiechec', email: 'testemail1'},
            {name: 'John Doe', email: 'testemail2'},
            {name: 'Jane Doe', email: 'testemail3'}
        ];
    }

    ngOnInit() {
    }

}
