// Storybook entry used only when STORYBOOK_ENABLED=true. Kept in JS so the
// generated (gitignored) storybook.requires file is not part of the typecheck.
const { registerRootComponent } = require('expo')
const { view } = require('./storybook.requires')

registerRootComponent(view.getStorybookUI())
