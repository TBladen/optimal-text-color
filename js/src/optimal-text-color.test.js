const { hexToRgb, optimalTextColor } = require('./optimal-text-color');

const colors = {
    white: '#FFFFFF',
    black: '#000000',
};

describe('hexToRgb', () => {
    test('Pure white', () => {
        expect(hexToRgb(colors.white)).toEqual({
            r: 255,
            g: 255,
            b: 255,
        });
    });

    test('Pure black', () => {
        expect(hexToRgb(colors.black)).toEqual({
            r: 0,
            g: 0,
            b: 0,
        });
    });
});

describe('optimalTextColor', () => {
    test('Black text is chosen for white background', () => {
        expect(optimalTextColor(colors.white, colors.white, colors.black)).toEqual(colors.black); 
        expect(optimalTextColor(colors.white, colors.black, colors.white)).toEqual(colors.black); 
    });

    test('White text is chosen for black background', () => {
        expect(optimalTextColor(colors.black, colors.white, colors.black)).toEqual(colors.white);
        expect(optimalTextColor(colors.black, colors.black, colors.white)).toEqual(colors.white);
    });
});