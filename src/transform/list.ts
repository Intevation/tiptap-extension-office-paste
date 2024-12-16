import { parseStyleAttribute } from "../utils";

export function transformLists(html: string): string {
    if (html.indexOf(`mso-list:`) === -1) {
        return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, `text/html`);

    let listStack: HTMLElement[] = [];
    let currentListId: string;
    const listElements = doc.querySelectorAll(`p[style*="mso-list:"]`);
    listElements.forEach(node => {
        const el = <HTMLElement>node;
        const [msoListId, msoListLevel] = parseMsoListAttribute(parseStyleAttribute(el)[`mso-list`]);

        // Check for start of a new list
        if (currentListId !== msoListId && (hasNonListItemSibling(el) || msoListLevel === 1)) {
            currentListId = msoListId;
            listStack = [];
        }

        while (msoListLevel > listStack.length) {
            const newList = createListElement(el);

            if (listStack.length > 0) {
                listStack[listStack.length - 1].appendChild(newList);
            } else {
                el.before(newList);
            }
            listStack.push(newList);
        }

        while (msoListLevel < listStack.length) {
            listStack.pop();
        }

        // Remove list item numbers and create li
        listStack[listStack.length - 1].appendChild(getListItemFromParagraph(el));
        el.remove();
    });

    return doc.documentElement.outerHTML;
}

function hasNonListItemSibling(el: HTMLElement): boolean {
    return (
        !el.previousElementSibling ||
        !(el.previousElementSibling.nodeName === `OL` || el.previousElementSibling.nodeName === `UL`)
    );
}

function getListItemFromParagraph(el: HTMLElement): HTMLElement {
    const li = document.createElement(`li`);
    li.innerHTML = el.innerHTML.replace(listTypeRegex, ``);

    return li;
}

// Parses `mso-list` style attribute
function parseMsoListAttribute(attr: string): [id: string, level: number] {
    const msoListValue: string = attr;
    const msoListInfos = msoListValue.split(` `);
    const msoListId = msoListInfos.find(e => /l[0-9]+/.test(e)) || ``;
    const msoListLevel = +(msoListInfos.find((e: string) => e.startsWith(`level`))?.substring(5) || 1);

    return [msoListId, msoListLevel];
}

const listTypeRegex = /<!--\[if \!supportLists\]-->((.|\n)*)<!--\[endif\]-->/m;
function getListPrefix(el: HTMLElement): string {
    const matches = el.innerHTML.match(listTypeRegex);
    if (matches?.length) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(matches[0], `text/html`);
        return doc.body.querySelector(`span`)?.textContent || ``;
    }

    return ``;
}

function createListElement(el: HTMLElement): HTMLElement {
    const listInfo = getListInfo(getListPrefix(el));
    const list = document.createElement(listInfo.type);
    if (listInfo.countType) {
        list.setAttribute(`type`, listInfo.countType);
    }
    if (listInfo.start > 1) {
        list.setAttribute(`start`, listInfo.start.toString());
    }
    return list;
}

const listOrderRegex = {
    number: /[0-9]+\./,
    romanLower: /(?=[mdclxvi])m*(c[md]|d?c*)(x[cl]|l?x*)(i[xv]|v?i*)\./,
    romanUpper: /(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)\./,
    letterLower: /[a-z]+\./,
    letterUpper: /[A-Z]+\./
};

function getListInfo(prefix: string): { type: string; start: number; countType: string | null } {
    let type = `ul`;
    let countType: string | null = null;
    let start = 1;
    if (listOrderRegex.number.test(prefix)) {
        type = `ol`;
        // @ts-ignore
        start = +prefix.match(listOrderRegex.number)[0].replace(`.`, ``);
    } else if (listOrderRegex.romanLower.test(prefix)) {
        type = `ol`;
        countType = `i`;
        // @ts-ignore
        start = +parseRomanNumber(prefix.match(listOrderRegex.romanLower)[0].replace(`.`, ``));
    } else if (listOrderRegex.romanUpper.test(prefix)) {
        type = `ol`;
        countType = `I`;
        // @ts-ignore
        start = +parseRomanNumber(prefix.match(listOrderRegex.romanUpper)[0].replace(`.`, ``));
    } else if (listOrderRegex.letterLower.test(prefix)) {
        type = `ol`;
        countType = `a`;
        // @ts-ignore
        start = +parseLetterNumber(prefix.match(listOrderRegex.letterLower)[0].replace(`.`, ``));
    } else if (listOrderRegex.letterUpper.test(prefix)) {
        type = `ol`;
        countType = `A`;
        // @ts-ignore
        start = +parseLetterNumber(prefix.match(listOrderRegex.letterUpper)[0].replace(`.`, ``));
    }

    return {
        type,
        start,
        countType
    };
}

