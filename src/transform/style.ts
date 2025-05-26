import { parseStyleAttribute } from "../utils";

export function transformMsoStyles(html: string): string {
    html = html.replace(/<o:p>(.*?)<\/o:p>/g, ``);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, `text/html`);
    doc.querySelectorAll(`[style*="mso-"]`).forEach(node => {
        const styles = parseStyleAttribute(node);
        const newStyles: string[] = [];
        for (const prop of Object.keys(styles)) {
            if (prop && !prop.startsWith(`mso-`)) {
                newStyles.push(`${prop}: ${styles[prop]}`);
            }
        }
        node.setAttribute(`style`, newStyles.join(`;`));
    });

    doc.querySelectorAll(`[style*="color: black"]`).forEach(node => {
        (node as HTMLElement).style.removeProperty(`color`);
    });

    return doc.documentElement.outerHTML;
}
