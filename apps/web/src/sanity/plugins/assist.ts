/**
 * Sets up the AI Assist plugin with preset prompts for content creation
 */

import { assist } from '@sanity/assist'

export const assistWithPresets = () =>
  assist({
    __presets: {},
  })
