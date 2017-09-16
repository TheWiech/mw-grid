import { MwColumnDirective } from './mw-column.directive';
import * as rxjsIsNumeric from 'rxjs/util/isNumeric';

describe('MwColumnDirective', () => {
    let directive: MwColumnDirective;

    beforeEach(() => {
        directive = new MwColumnDirective();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('ngOnInit method', () => {
        it('should call validateWidths', () => {
            spyOn(directive, 'validateWidths');
            directive.ngOnInit();
            expect(directive.validateWidths).toHaveBeenCalled();
        });
    });

    describe('validateWidths method', () => {
        it('should call validateWidthValue when width is set', () => {
            directive.width = '150';
            spyOn(directive, 'validateWidthValue');
            directive.validateWidths();
            expect(directive.validateWidthValue).toHaveBeenCalledWith('150', 'width');
        });

        it('should call validateWidthValue when width is set with star sized value', () => {
            directive.width = '170*';
            spyOn(directive, 'validateWidthValue');
            directive.validateWidths();
            expect(directive.validateWidthValue).toHaveBeenCalledWith('170', 'width');
        });

        it('should throw an error when width is set with invalid star sized value', () => {
            directive.width = '170*1';
            expect(() => {
                directive.validateWidths();
            }).toThrowError('star sized width on mw-column must have * at the end');
        });

        it('should call validateWidthValue with minWidth when minWidth is set', () => {
            directive.minWidth = 170;
            spyOn(directive, 'validateWidthValue');
            directive.validateWidths();
            expect(directive.validateWidthValue).toHaveBeenCalledWith(170, 'minWidth');
        });

        it('should not call validateWidthValue when none of the width values are set', () => {
            spyOn(directive, 'validateWidthValue');
            directive.validateWidths();
            expect(directive.validateWidthValue).not.toHaveBeenCalledWith();
        });
    });

    describe('validateWidthValue method', () => {
        it('should throw error when isNumeric returns false', () => {
            spyOn(rxjsIsNumeric, 'isNumeric').and.returnValue(false);
            expect(() => {
                directive.validateWidthValue('110', 'maxWidth');
            }).toThrowError('maxWidth on mw-column must be a number');
        });

        it('should throw error when passed in number < 0', () => {
            spyOn(rxjsIsNumeric, 'isNumeric').and.returnValue(true);
            expect(() => {
                directive.validateWidthValue('-110', 'maxWidth');
            }).toThrowError('maxWidth on mw-column must be greater than 0');
        });

        it('should not throw error when passed in number > 0', () => {
            spyOn(rxjsIsNumeric, 'isNumeric').and.returnValue(true);
            expect(() => {
                directive.validateWidthValue('110', 'maxWidth');
            }).not.toThrowError('maxWidth on mw-column must be greater than 0');
        });
    });

    describe('isStarSizedWidth method', () => {
        it('should return false when width is not set', () => {
            expect(directive.isStarSizedWidth()).toEqual(false);
        });

        it('should return false when * is not found at end of width string', () => {
            directive.width = '170*1';
            expect(directive.isStarSizedWidth()).toEqual(false);
        });

        it('should return false when is not found in width string', () => {
            directive.width = '170';
            expect(directive.isStarSizedWidth()).toEqual(false);
        });

        it('should return true when * is found at end of width string', () => {
            directive.width = '170*';
            expect(directive.isStarSizedWidth()).toEqual(true);
        });
    });

    describe('getStarSizedWidth method', () => {
        it('should return text before start *', () => {
            directive.width = '170*';
            expect(directive.getStarSizedWidth()).toEqual(170);
        });
    });

    describe('getMinWidth method', () => {
        it('should return standardWidth when minWidth, maxWidth, and width are not set', () => {
            expect(directive.getMinWidth()).toEqual('150px');
        });

        it('should return maxWidth when minWidth and width are not set', () => {
            directive.maxWidth = 140;
            expect(directive.getMinWidth()).toEqual('140px');
        });

        it('should return minWidth when minWidth is set', () => {
            directive.minWidth = 120;
            expect(directive.getMinWidth()).toEqual('120px');
        });

        it('should return 0 when minWidth is not set and width is set', () => {
            directive.width = '120';
            expect(directive.getMinWidth()).toEqual('0');
        });

        it('should return 0 when minWidth is not set and width and maxWidth are set', () => {
            directive.width = '120';
            directive.maxWidth = 130;
            expect(directive.getMinWidth()).toEqual('0');
        });
    });

    describe('getMaxWidth method', () => {
        it('should return standardWidth when minWidth, maxWidth, and width are not set', () => {
            expect(directive.getMaxWidth()).toEqual('150px');
        });

        it('should return minWidht when maxWidth and width are not set', () => {
            directive.minWidth = 140;
            expect(directive.getMaxWidth()).toEqual('140px');
        });

        it('should return maxWidth when maxWidth is set', () => {
            directive.maxWidth = 120;
            expect(directive.getMaxWidth()).toEqual('120px');
        });

        it('should return \'\' when maxWidth is not set and width is set', () => {
            directive.width = '120';
            expect(directive.getMaxWidth()).toEqual('');
        });

        it('should return \'\' when maxWidth is not set and width and minWidth are set', () => {
            directive.width = '120';
            directive.minWidth = 130;
            expect(directive.getMaxWidth()).toEqual('');
        });
    });
});
