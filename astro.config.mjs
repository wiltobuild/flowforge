// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { base, site } from './site-config.mjs';

// Sidebar structure is built in M0-T7; design tokens are wired in M0-T3.
// This config is deliberately minimal — see docs/08-build-plan.md.
export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'FlowForge',
      description:
        'A reference for building with AI agents on consumer subscriptions.',
      // Order is deliberate and specified in docs/01: what people need, most
      // first. Plans sits at #2 because it answers the loudest question.
      // Concepts sits low despite being foundational — people arrive with a
      // task, not a curiosity, and reach concepts via inline links instead.
      sidebar: [
        { label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
        { label: 'Plans and usage', items: [{ autogenerate: { directory: 'plans' } }] },
        { label: 'Playbooks', items: [{ autogenerate: { directory: 'playbooks' } }] },
        { label: 'Prompting', items: [{ autogenerate: { directory: 'prompting' } }] },
        { label: 'Agents', items: [{ autogenerate: { directory: 'agents' } }] },
        { label: 'Skills', items: [{ autogenerate: { directory: 'skills' } }] },
        { label: 'Tools', items: [{ autogenerate: { directory: 'tools' } }] },
        { label: 'Concepts', items: [{ autogenerate: { directory: 'concepts' } }] },
        { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
        { label: 'Cohort', items: [{ autogenerate: { directory: 'cohort' } }] },
      ],
      pagefind: true,
      customCss: ['./src/styles/tokens.css', './src/styles/level.css'],
      components: {
        // Renders Starlight's theme picker plus our level toggle, rather than
        // reimplementing the header.
        ThemeSelect: './src/components/ThemeSelect.astro',
        // Prepends the mandatory 2–3 `next` links to Starlight's own footer.
        // Overriding this slot rather than the page layout means every content
        // page gets the block for free and we inherit future footer changes.
        Footer: './src/components/Footer.astro',
      },
      head: [
        {
          // Resolve the reading level BEFORE first paint. Doing this in a
          // deferred script would cause a visible reflow as above-level
          // sections collapse — docs/06 principle 4 forbids layout shift.
          tag: 'script',
          content: `(()=>{try{var l=localStorage.getItem("ff-level");if(l!=="beginner"&&l!=="intermediate"&&l!=="advanced")l="beginner";document.documentElement.dataset.level=l}catch(e){document.documentElement.dataset.level="beginner"}})();`,
        },
      ],
    }),
  ],
});
