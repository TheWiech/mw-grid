import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mw-grid-headers',
  templateUrl: './mw-grid-headers.component.html',
  styleUrls: ['./mw-grid-headers.component.scss']
})
export class MwGridHeadersComponent implements OnInit {
    @Input() public headers: Array<String>;

    constructor() { }

    ngOnInit() {
    }

}
