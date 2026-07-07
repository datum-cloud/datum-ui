import type { TestRunnerConfig } from '@storybook/test-runner'
import { getStoryContext } from '@storybook/test-runner'
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright'

/**
 * Storybook test-runner configuration.
 *
 * Every story is visited in a real browser so that:
 *  - any `play()` interaction runs as a smoke/interaction test, and
 *  - axe-core runs against the rendered story, turning the addon-a11y rules
 *    configured in preview.tsx (e.g. color-contrast) into CI failures on
 *    accessibility violations instead of silent, dev-only warnings.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context)

    // Honour a per-story opt-out: parameters.a11y.disable === true
    if (storyContext.parameters?.a11y?.disable) {
      return
    }

    // Apply the story's a11y rule configuration (from preview.tsx / story params).
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    })

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  },
}

export default config
