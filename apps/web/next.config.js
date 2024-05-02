module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@repo/dally', '@repo/ui', '@repo/codegen'],
  experimental: {
    // Used to guard against accidentally leaking SANITY_API_READ_TOKEN to the browser
    taint: true,
  },
}
