/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import '../../../packages/ui/src/styles.css';

// Decorators only run when a story renders, so docs-only (MDX) pages never got a theme and fell back to
// the OS setting. Apply the theme directly: once on load, and again whenever the toolbar changes.
const apply = (theme?: string) => {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  document.body.style.background = 'var(--color-bg-surface)';
};
apply('light');
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals: { theme?: string } }) => apply(globals.theme));

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Theme', toolbar: { icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true } },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, ctx) => {
      apply(ctx.globals.theme);
      return Story();
    },
  ],

  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error', 
    }
  }
};
export default preview;
