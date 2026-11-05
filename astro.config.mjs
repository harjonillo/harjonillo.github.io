// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { visit } from 'unist-util-visit';

/**
 * In the lists collection (src/content/lists/*), render a literal `*` after an
 * item as a mauve favorite star — so the lists stay editable as the same plain
 * Markdown checklists they were written as.
 */
function rehypeFavStars() {
  return (/** @type {any} */ tree, /** @type {any} */ file) => {
    const path = String(file.path ?? '');
    if (!/[\\/]content[\\/]lists[\\/]/.test(path)) return;
    visit(tree, 'text', (/** @type {any} */ node, /** @type {any} */ index, /** @type {any} */ parent) => {
      if (!parent || typeof index !== 'number' || !node.value.includes('*')) return;
      const parts = String(node.value).split('*');
      /** @type {any[]} */
      const children = [];
      parts.forEach((part, i) => {
        if (part) children.push({ type: 'text', value: part });
        if (i < parts.length - 1) {
          children.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['fav'], title: 'a favorite' },
            children: [{ type: 'text', value: '★' }],
          });
        }
      });
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}

const inJournal = (/** @type {any} */ file) =>
  /[\\/]content[\\/]journal[\\/]/.test(String(file.path ?? ''));

const BLOCKS = new Set(['p', 'li', 'blockquote', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * @param {string} tagName
 * @param {string[]} className
 * @param {any[]} children
 * @param {Record<string, any>} [extra]
 */
const el = (tagName, className, children, extra = {}) => ({
  type: 'element',
  tagName,
  properties: { ...(className.length ? { className } : {}), ...extra },
  children,
});

/**
 * In the journal (src/content/journal/*), turn Markdown footnotes into
 * Tufte-style side notes. Each reference becomes a small number plus the note
 * text, floated into the right rail on wide screens. A second copy sits at the
 * end of the paragraph and shows instead on narrow screens, so the note never
 * interrupts a sentence. A footnote whose label starts with `note-` renders
 * without a number. The footnotes section at the bottom is removed.
 */
function rehypeSidenotes() {
  return (/** @type {any} */ tree, /** @type {any} */ file) => {
    if (!inJournal(file)) return;

    // 1. Collect footnote definitions as phrasing content, then drop the section.
    /** @type {Map<string, any[]>} */
    const defs = new Map();
    tree.children = tree.children.filter((/** @type {any} */ node) => {
      if (node.type !== 'element' || node.tagName !== 'section' || !node.properties?.dataFootnotes)
        return true;
      visit(node, 'element', (/** @type {any} */ li) => {
        if (li.tagName !== 'li' || !li.properties?.id) return;
        // strip the ↩ back-links
        visit(li, 'element', (/** @type {any} */ n, /** @type {any} */ i, /** @type {any} */ parent) => {
          if (parent && typeof i === 'number' && n.tagName === 'a' && 'dataFootnoteBackref' in n.properties) {
            parent.children.splice(i, 1);
            return i;
          }
        });
        /** @type {any[]} */
        const parts = [];
        for (const child of li.children) {
          if (child.type === 'text' && !child.value.trim()) continue;
          if (child.type !== 'element' || child.tagName !== 'p') {
            throw new Error(
              `${file.path}: footnote "${li.properties.id}" contains a <${child.tagName ?? child.type}>. ` +
                'Side notes can only hold text and inline formatting (one or more paragraphs).',
            );
          }
          if (parts.length) parts.push({ type: 'text', value: ' ' });
          parts.push(...child.children);
        }
        const last = parts.at(-1);
        if (last?.type === 'text') last.value = last.value.trimEnd();
        defs.set(String(li.properties.id), parts);
      });
      return false;
    });
    if (!defs.size) return;

    // 2. Find every reference (<sup><a data-footnote-ref>) with its parent and block.
    /** @type {{ parent: any, index: number, block: any, id: string }[]} */
    const refs = [];
    const walk = (/** @type {any} */ node, /** @type {any} */ block) => {
      if (!node.children) return;
      const here = node.type === 'element' && BLOCKS.has(node.tagName) ? node : block;
      node.children.forEach((/** @type {any} */ child, /** @type {number} */ index) => {
        const a = child.tagName === 'sup' && child.children?.find((/** @type {any} */ c) => c.type === 'element');
        if (a && a.tagName === 'a' && a.properties?.dataFootnoteRef) {
          refs.push({ parent: node, index, block: here, id: String(a.properties.href).slice(1) });
        } else {
          walk(child, here);
        }
      });
    };
    walk(tree, null);

    // 3. Number them in reading order; build the side notes.
    let count = 0;
    /** @type {Map<string, string | null>} */
    const numbers = new Map();
    /** @type {Set<string>} */
    const placed = new Set();
    const plans = refs.map((ref) => {
      if (!numbers.has(ref.id)) {
        numbers.set(ref.id, /^user-content-fn-note-/.test(ref.id) ? null : String(++count));
      }
      const num = numbers.get(ref.id) ?? null;
      const first = !placed.has(ref.id);
      placed.add(ref.id);
      return { ...ref, num, first };
    });

    /**
     * @param {string | null} num
     * @param {string} variant
     * @param {string} id
     */
    const note = (num, variant, id) =>
      el('span', ['sidenote', variant], [
        ...(num ? [el('span', ['sn-num'], [{ type: 'text', value: num }]), { type: 'text', value: ' ' }] : []),
        ...structuredClone(defs.get(id) ?? []),
      ], { role: 'note' });

    // Narrow-screen copies go at the end of their block first (appending never
    // shifts the indices of the references), then references are replaced in
    // reverse order so earlier indices stay valid.
    for (const p of plans) {
      if (p.first && p.block && defs.has(p.id)) p.block.children.push(note(p.num, 'sn-after', p.id));
    }
    for (const p of [...plans].reverse()) {
      /** @type {any[]} */
      const nodes = [];
      if (p.num) nodes.push(el('sup', ['sn-ref'], [{ type: 'text', value: p.num }]));
      if (p.first && defs.has(p.id)) nodes.push(note(p.num, 'sn-inline', p.id));
      p.parent.children.splice(p.index, 1, ...nodes);
    }
  };
}

/**
 * In the journal, a paragraph holding only an image that has a title becomes
 * <figure> with the title as its <figcaption>:
 *   ![alt text](../../assets/journal/x.png "Fig. 1. Caption.")
 * The <img> node itself is kept so Astro's image pass still optimizes it.
 */
function rehypeFigures() {
  return (/** @type {any} */ tree, /** @type {any} */ file) => {
    if (!inJournal(file)) return;
    visit(tree, 'element', (/** @type {any} */ node, /** @type {any} */ index, /** @type {any} */ parent) => {
      if (node.tagName !== 'p' || !parent || typeof index !== 'number') return;
      const kids = node.children.filter(
        (/** @type {any} */ c) => !(c.type === 'text' && !c.value.trim()),
      );
      const img = kids[0];
      if (kids.length !== 1 || img.tagName !== 'img' || !img.properties?.title) return;
      const caption = String(img.properties.title);
      delete img.properties.title;
      parent.children[index] = el('figure', [], [img, el('figcaption', [], [{ type: 'text', value: caption }])]);
    });
  };
}

// TODO: switch `site` to the custom domain once registered (§11 of the brief).
export default defineConfig({
  site: 'https://harjonillo.github.io',
  integrations: [react()],
  markdown: {
    rehypePlugins: [rehypeFavStars, rehypeSidenotes, rehypeFigures],
    // Colors come from --astro-code-* in tokens.css, so code follows light/dark.
    shikiConfig: { theme: 'css-variables' },
  },
});
