import assert from "node:assert";
import { describe, it } from "node:test";
import { parseLetterNumber, parseRomanNumber } from "./utils";


describe(`parseLetterNumber function`, () => {
    it(`test one digit numbers`, () => {
        assert.strictEqual(parseLetterNumber(`a`), 1);
        assert.strictEqual(parseLetterNumber(`b`), 2);
        assert.strictEqual(parseLetterNumber(`g`), 7);
        assert.strictEqual(parseLetterNumber(`n`), 14);
    });

    it(`test two digit numbers`, () => {
        assert.strictEqual(parseLetterNumber(`aa`), 27);
        assert.strictEqual(parseLetterNumber(`be`), 57);
        assert.strictEqual(parseLetterNumber(`gt`), 202);
        assert.strictEqual(parseLetterNumber(`no`), 379);
    });

    it(`test big numbers`, () => {
        assert.strictEqual(parseLetterNumber(`popeye`), 197241907);
        assert.strictEqual(parseLetterNumber(`openslides`), 84828503480493);
        assert.strictEqual(parseLetterNumber(`magma`), 5963335);
    });

    it(`test case irrelevant`, () => {
        assert.strictEqual(parseLetterNumber(`scHwaRzteE`), 103858431216103);
    });
});

describe(`parseRomanNumber function`, () => {
    it(`test simple one digit roman numbers`, () => {
        assert.strictEqual(parseRomanNumber(`I`), 1);
        assert.strictEqual(parseRomanNumber(`L`), 50);
        assert.strictEqual(parseRomanNumber(`M`), 1000);
    });

    it(`test summation`, () => {
        assert.strictEqual(parseRomanNumber(`III`), 3);
        assert.strictEqual(parseRomanNumber(`XII`), 12);
        assert.strictEqual(parseRomanNumber(`CV`), 105);
        assert.strictEqual(parseRomanNumber(`DX`), 510);
    });

    it(`test subtraction`, () => {
        assert.strictEqual(parseRomanNumber(`XL`), 40);
        assert.strictEqual(parseRomanNumber(`VX`), 5);
        assert.strictEqual(parseRomanNumber(`ICD`), 399);
    });

    it(`test complex operations`, () => {
        assert.strictEqual(parseRomanNumber(`IDC`), 599);
        assert.strictEqual(parseRomanNumber(`CMVI`), 906);
    });

    it(`test case irrelevant`, () => {
        assert.strictEqual(parseRomanNumber(`cMvI`), 906);
    });
});
