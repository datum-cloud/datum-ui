/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@repo/dally', '@repo/ui'],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
