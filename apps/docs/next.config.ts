import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

const config = {
  reactStrictMode: true,
  transpilePackages: ['@datum-cloud/datum-ui'],
}

export default withMDX(config)
