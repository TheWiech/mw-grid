import { TestBed, inject } from '@angular/core/testing';

import { RowFactoryService } from './row-factory.service';

describe('RowFactoryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RowFactoryService]
        });
    });

    it('should be created', inject([RowFactoryService], (service: RowFactoryService) => {
        expect(service).toBeTruthy();
    }));
});
