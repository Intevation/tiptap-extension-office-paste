/**
 * Parses a roman number string into a number
 *
 * Example: a -> 1, ab -> 28, ...
 */
export function parseRomanNumber(roman: string): number {
    roman = roman.toUpperCase();
    let value = 0;
    const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let i = roman.length;
    let lastVal = 0;
    while (i--) {
        if (values[roman.charAt(i)] >= lastVal) {
            value += values[roman.charAt(i)];
        } else {
            value -= values[roman.charAt(i)];
        }
        lastVal = values[roman.charAt(i)];
    }

    return value;
}

/**
 * Parses a list item index of letters.
 *
 * Example: a -> 1, ab -> 28, ...
 */
export function parseLetterNumber(str: string): number {
    const alphaVal = (s: string): number => s.toLowerCase().charCodeAt(0) - 97 + 1;
    let value = 0;
    let i = str.length;
    while (i--) {
        const factor = Math.pow(26, str.length - i - 1);
        value += alphaVal(str.charAt(i)) * factor;
    }
    return value;
}

/**
 * Removes the sourounding tag of a node
 *
 * @param {Node} node
 * @returns {Node}
 */
export function unwrapNode(node: Node): void {
    const parent = node.parentNode;
    while (node.firstChild) {
        parent?.insertBefore(node.firstChild, node);
    }
    parent?.removeChild(node);
}
