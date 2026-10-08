<div align="center">
  <br />

  <p align="center">
  <img src="./docs/preview.png" width="900"/>
  </p>

  <h1>⚓ Harbor</h1>

  <p>
    A token-driven design system for React, with accessible components and living documentation.<br/>
    Three product dashboards run on it, and every color pairing is contrast-checked on every build.
  </p>

  <p>
    <a href="https://YOUR-STORYBOOK-URL">Storybook</a> ·
    <a href="https://YOUR-DASHBOARDS-URL">Dashboards demo</a>
  </p>

  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_18-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Storybook_10-black?style=for-the-badge&logoColor=white&logo=storybook&color=FF4785" alt="storybook" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
    <img src="https://img.shields.io/badge/-Radix_UI-black?style=for-the-badge&logoColor=white&color=161618" alt="radix ui" />
    <img src="https://img.shields.io/badge/-pnpm_workspaces-black?style=for-the-badge&logoColor=white&logo=pnpm&color=F69220" alt="pnpm" />
    <img src="https://img.shields.io/badge/-WCAG_AA_contrast_checked-black?style=for-the-badge&logoColor=white&color=2E7D32" alt="wcag aa contrast checked" />
    <img src="https://img.shields.io/github/actions/workflow/status/jeanrichardson610/harbor/ci.yml?style=for-the-badge&label=CI&logo=githubactions&logoColor=white" alt="ci status" />
  </div>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🗂️ [Project Structure](#project-structure)
6. 📖 [Case Study](#case-study)
7. 🕸️ [Snippets](#snippets)
8. ♿ [Accessibility](#accessibility)
9. 🧠 [Architecture Notes](#architecture-notes)
10. 📌 [Known Limitations](#known-limitations)

## <a name="introduction">🤖 Introduction</a>

Harbor is a design system, not just a component library. It has three layers that depend on each other: **design tokens** (primitive, semantic, and component tiers), **components** that read only from those tokens, and **documentation** that says when to use each component and how it behaves with a keyboard.

It was built to answer a practical question: what does it take for several products to share one visual language without copying styles between them? The answer here is a small, rigorous system plus a consuming app. `apps/dashboards` rebuilds a banking, a weather, and an anime dashboard using only Harbor components, so the system is exercised by real screens, not just by isolated stories.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **React 18** + **TypeScript**
- **Vite** (library mode) for the component package
- **Storybook 10** — component docs, states, and foundations pages (MDX)
- **Design tokens** — JSON source, compiled to CSS variables, JSON, and a Tailwind preset by a small build script
- **Radix UI primitives** — Dialog and Select only, where focus management and listbox semantics are worth not reinventing
- **pnpm workspaces** — tokens, UI, docs, and the dashboards app in one monorepo
- **Plain CSS** — components are styled with CSS variables, so they work with or without Tailwind

## <a name="features">🔋 Features</a>

👉 **Three-tier tokens** — primitive (`--color-blue-600`), semantic (`--color-action-primary-bg`), and component (`--button-radius`), compiled to CSS variables, JSON, and a Tailwind preset.

👉 **Light and dark themes** — a theme is a different mapping from semantic tokens to primitives, so no component changes when the theme does.

👉 **12 components** — Button, TextField, Checkbox, Switch, Select, Dialog, Tabs, Badge, Alert, Card, Toast, and Table, each with its states documented in Storybook.

👉 **Contrast measured on every build** — a script computes WCAG contrast for every foreground and background pairing in both themes, and the build fails if any pairing misses its target.

👉 **Foundations pages** — color (with the measured contrast table), typography, spacing, shape, elevation, and motion.

👉 **A consuming product** — three dashboards (banking, weather, anime) built with Harbor components, including data loading, error, empty, and form validation states.

## <a name="quick-start">🤸 Quick Start</a>

**Prerequisites:** [Node.js](https://nodejs.org/en) 20.19 or newer and [pnpm](https://pnpm.io/).

```bash
git clone <your-repo-url>
cd harbor
pnpm install
pnpm dev                # builds tokens, opens Storybook on http://localhost:6006
```

Other commands:

```bash
pnpm test:contrast      # contrast check for every color pairing, both themes
pnpm build              # tokens -> @harbor/ui -> static Storybook
pnpm test:a11y          # automated accessibility checks on every story (run after build)

pnpm build:ui           # build the component package the dashboards import
pnpm --filter dashboards dev
```

## <a name="project-structure">🗂️ Project Structure</a>

```
packages/
  tokens/
    src/                 – primitive.json, semantic.json (light + dark), component.json
    build.mjs            – compiles tokens to CSS variables, JSON, and a Tailwind preset
    contrast.mjs         – measures WCAG contrast; fails the build below target
  ui/
    src/<Component>/     – component, CSS, and Storybook stories for each of the 12
apps/
  docs/                  – Storybook config and MDX foundations pages
  dashboards/            – banking, weather, and anime dashboards using only Harbor
.github/workflows/       – CI: contrast gate, build, accessibility checks
```

## <a name="case-study">📖 Case Study</a>

<!-- Add before/after screenshots of the original dashboards and the Harbor versions here. -->

**Problem.** My earlier dashboards each styled their own buttons, colors, and overlays. Inconsistencies appeared by omission, not by choice: a button missing the hover style its siblings had, a dropdown rendered behind a card because two stacking values tied. Nothing was wrong with any single component. There was no shared source of truth to check against.

**Approach.** I defined the shared decisions once, as tokens, and made components read only from them. Contrast became a build step instead of a manual review. Dialog and Select use Radix, because focus management and listbox behavior are risky to hand-roll. Tabs are hand-rolled to the WAI-ARIA pattern. Every component documents its states, a usage rule, and its keyboard behavior.

**What the checks caught.** The first contrast run flagged a warning color at 4.03:1 on its tinted background, against a 4.5:1 target. Dark-mode status colors also needed darker tints. Both were fixed in the tokens and every component picked up the change.

**Result.** The banking, weather, and anime dashboards now run on the same components and tokens: forms with validation, tables, dialogs, toasts, tabs, and loading and error states. They are used as shipped, with only page layout written around them.

**What I learned.** A shared system works so well that the three dashboards now look alike. The original products had their own character, and a system should allow that. Next is multi-brand theming, so each product can differ through tokens without touching a component.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>packages/tokens/src</code> — one decision, three tiers</summary>

A component never names a raw color. The semantic token decides what a color is for, and each theme decides which primitive it points at:

```json
{
  "light": { "color": { "action": { "primary": { "bg": { "$value": "{color.blue.600}" } } } } },
  "dark":  { "color": { "action": { "primary": { "bg": { "$value": "{color.blue.500}" } } } } }
}
```

The build script turns references into CSS variables, so a theme switch is a one-attribute change at runtime:

```css
:root {
  --color-blue-600: hsl(222 78% 46%);
  --color-action-primary-bg: var(--color-blue-600);
  --button-radius: var(--radius-md);
}
:root[data-theme="dark"] {
  --color-action-primary-bg: var(--color-blue-500);
}
```

</details>

<details>
<summary><code>packages/tokens/contrast.mjs</code> — accessibility as a build step</summary>

Each pairing declares what it is, the two tokens, and the WCAG target (4.5 for text, 3 for component boundaries and focus indicators):

```javascript
const pairs = [
  ['Body text on surface', 'color-text-primary', 'color-bg-surface', 4.5],
  ['Input border', 'color-border-input', 'color-bg-input', 3],
  ['Focus ring on surface', 'color-focus-ring', 'color-bg-surface', 3],
  // ...
];
```

Every pairing is measured in both themes. A miss fails the build with a message that names the pairing:

```
FAIL light: Warning badge and alert 4.03:1 (needs 4.5:1)
contrast: 36/36 pairings pass
```

</details>

<details>
<summary><code>packages/ui/src/Choice/Switch.tsx</code> — native semantics over custom widgets</summary>

The switch is a real checkbox with `role="switch"`, so Space toggles it, screen readers announce on or off, and the focus ring lands on the control itself. The whole label is the click target:

```tsx
<label className="hb-choice">
  <input ref={ref} type="checkbox" role="switch" {...rest} />
  <span>{label}</span>
</label>
```

</details>

## <a name="accessibility">♿ Accessibility</a>

- **Contrast is measured, not assumed.** Text pairings are held to 4.5:1 and component boundaries and focus rings to 3:1, in both themes, on every build.
- **Visible focus** on every interactive element, with a focus ring token that has its own measured contrast.
- **Touch targets of at least 44px** for buttons, fields, switches, tabs, and close buttons.
- **Keyboard behavior is documented per component.** Tabs follow the WAI-ARIA pattern: roving tabindex, arrow keys, Home and End, and disabled tabs are skipped. Dialog traps focus and returns it to the trigger.
- **Live regions where needed.** Toasts announce politely, warnings and errors use `role="alert"`, and field errors are linked to their inputs with `aria-describedby`.
- **Reduced motion.** Animations honor `prefers-reduced-motion`.
- **Color never carries meaning alone.** Every status badge and alert says its status in words.
- **Automated checks run on every story,** as part of CI.

Automated checks cover part of accessibility, not all of it. Manual keyboard and screen reader testing is still on the to-do list, so this README does not claim full WCAG compliance.

## <a name="architecture-notes">🧠 Architecture Notes</a>

**Why three token tiers?** Primitives hold the raw palette. Semantic tokens give a color a job. Component tokens exist only where a component needs its own decision, such as the button's height. A rebrand touches primitives and semantics. It never touches a component.

**Why fail the build on contrast?** A guideline that depends on someone remembering to check it eventually gets skipped. A check that stops the build cannot be skipped, and it caught real problems on its first run.

**Why Radix for Dialog and Select, but hand-rolled Tabs?** Focus trapping, scroll locking, and listbox typeahead are easy to get subtly wrong, so I used a well-tested primitive and styled it entirely from tokens. Tabs have a small, well-specified pattern, so I implemented it directly with no dependency.

**Why plain CSS variables instead of Tailwind?** Tokens as CSS variables work in any stack. A Tailwind preset is generated from the same source for projects that use it, so the system does not depend on one tool.

**Why a separate consuming app?** A design system that only shows itself in isolated stories has never been tested by real screens. Building the dashboards on it surfaced gaps, including a loading skeleton, an error state with retry, a bar chart, and a page header. Those were written in the app first and are now candidates to move into Harbor.

## <a name="known-limitations">📌 Known Limitations</a>

These are known gaps, not oversights:

- **One brand.** The three dashboards share one palette. Multi-brand theming through tokens is the next planned step.
- **No image components yet.** There is no avatar, media card, or image with fallback, so the dashboards show no cover art or icons.
- **Toasts do not pause on hover.** Errors stay until dismissed, but success toasts still close on a timer.
- **Table has no sorting, selection, or pagination.**
- **No layout grid or iconography.** Spacing and breakpoints are left to each app.
- **No Figma library.** The tokens and components exist in code only, so the design-side handoff is not built yet.
- **Not published to npm,** and there is no changelog or versioning process yet.
- **Manual accessibility testing is not done.** See the note in the Accessibility section.