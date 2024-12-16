import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { transformMsoStyles } from './transform/style';
import { transformRemoveBookmarks } from './transform/bookmark';
import { transformLists } from './transform/list';

const OfficePaste = Extension.create({
    priority: 99999,
    name: `office-paste`,

    addProseMirrorPlugins() {
        return [OfficePastePlugin];
    }
});

const OfficePastePlugin = new Plugin({
    props: {
        transformPastedHTML(html: string): string {
            if (html.indexOf(`microsoft-com`) !== -1 && html.indexOf(`office`) !== -1) {
                html = transformLists(html);
                html = transformRemoveBookmarks(html);
                html = transformMsoStyles(html);
            }
            return html;
        }
    }
});

export default OfficePaste;
