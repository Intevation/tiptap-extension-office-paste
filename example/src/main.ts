import './style.css'
import { Editor, Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import OfficePaste from '@intevation/tiptap-extension-office-paste'
import { Plugin, PluginKey } from '@tiptap/pm/state';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

const editor = new Editor({
  element: document.querySelector('.editor')!,
  extensions: [
    StarterKit,
    OfficePaste,
    TableRow,
    TableCell,
    TableHeader,
    Table,
    Extension.create({
      priority: 100000,
      onUpdate: () => {
        document.querySelector(`.output-html`)!.textContent = editor.getHTML();
      },
      addProseMirrorPlugins() {
          return [new Plugin({
            key: new PluginKey('get-paste-paste'),
            props: {
                transformPastedHTML(html: string): string {
                  document.querySelector(`.input-html`)!.textContent = html;
                  return html;
                }
            }
          })];
      }
    })
  ],
  content: '<p>Hello World!</p>',
})
