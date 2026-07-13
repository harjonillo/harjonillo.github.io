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

// TODO: switch `site` to the custom domain once registered (§11 of the brief).
export default defineConfig({
  site: 'https://harjonillo.github.io',
  integrations: [react()],
  markdown: { rehypePlugins: [rehypeFavStars] },
});
