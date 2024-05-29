'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from '@sanity/vision'
import { PluginOptions, defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/lib/api'
import { locate } from '@/sanity/plugins/locate'
import { pageStructure, singletonPlugin } from '@/sanity/plugins/settings'
import { assistWithPresets } from '@/sanity/plugins/assist'
import settings from '@/sanity/schemas/singletons/settings'

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [settings],
  },
  plugins: [
    presentationTool({
      locate,
      previewUrl: { previewMode: { enable: '/api/draft' } },
    }),
    structureTool({ structure: pageStructure([settings]) }),
    singletonPlugin([settings.name]),
    assistWithPresets(),
    process.env.NODE_ENV === 'development' &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
})
