import { parseStyleAttribute } from "../utils";

export function transformMsoHtmlClasses(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, `text/html`);
    doc.querySelectorAll(`p[class*="MsoNormal"]`).forEach(node => {
        node.classList.remove(`MsoNormal`);
    });

    return doc.documentElement.outerHTML;
}
