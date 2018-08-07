'use strict';

/**
 * Convert hexadecimal color to RGB representation
 * 
 * @param {string} hexString hexadecimal color representation (e.g. #cccccc)
 * @returns {{r: number, g: number, b: number}} RGB color representation
 */
function hexToRgb(hexColor) {
    const hexNumber = parseInt(hexColor.replace('#', ''), 16);

    return {
        r: (hexNumber >> 16) & 255,
        g: (hexNumber >> 8) & 255,
        b: hexNumber & 255,
    };
}

function adjustGamma(x) {
    return Math.pow((x + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the relative luminance of an RGB color
 * 
 * Relative luminance is a real number between 0 (dark) and
 * 1 (bright) that can be used to compare the brightness of
 * colors.
 * 
 * @param {{r: number, g: number, b: number}} color
 * @returns {number}
 */
function relativeLuminance(color) {
    const sColor = Object.entries(color).reduce(
        (col, [k, v]) => Object.assign(col, { 
            [k]: v / 255,
        }),
        {}
    );

    const l = Object.entries(color).reduce(
        (col, [k, v]) => Object.assign(col, { 
            [k]: v <= 0.03928 ? (v / 12.92) : adjustGamma(v),
        }),
        {}
    );

    return 0.2126 * l.r + 0.7152 * l.g + 0.0722 * l.b;
}

/**
 * Calculate the contrast ratio between two colors
 * 
 * Contrast ratio is a real number between 0 and 1 that
 * can be used to compare the contrast between different
 * colors. A higher contrast ratio indicates more contrast.
 * 
 * @param {number} lightColorLuminance 
 * @param {number} darkColorLuminance 
 * @returns {number}
 */
function contrastRatio(lightColorLuminance, darkColorLuminance) {
    return (lightColorLuminance + 0.05) / (darkColorLuminance + 0.05);
}

/**
 * Select the optimal text color from the given colors
 * 
 * The selected color will have the highest contrast to the
 * background color.
 * 
 * @param {string} backgroundColor 
 * @param {string[]} textColors
 * @returns {string}
 */
function optimalTextColor(backgroundColor, ...textColors) {
    if (textColors.length === 0) {
        throw new Error('Expected at least one text color');
    }

    const backgroundColorRgb = hexToRgb(backgroundColor);
    const backgroundLuminance = relativeLuminance(backgroundColorRgb);

    const textColorRgbs = textColors.map(hexToRgb);
    const contrastRatios = textColorRgbs.map((textColor) => {
        const textLuminance = relativeLuminance(textColor);

        return contrastRatio(
            Math.max(backgroundLuminance, textLuminance),
            Math.min(backgroundLuminance, textLuminance)
        );
    });

    const indexofGreatestRatio = contrastRatios.reduce(
        (max, current, i) => current > max.value ? { value: current, index: i } : max,
        { index: 0, value: contrastRatios[0] }
    ).index;

    return textColors[indexofGreatestRatio];
}

module.exports = {
    hexToRgb,
    relativeLuminance,
    contrastRatio,
    optimalTextColor,
};
