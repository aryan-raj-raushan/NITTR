/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      'assets-static-prod.displate.com',
      'previews.dropbox.com',
      'images.pexels.com',
      'static.displate.com',
      'myxtur.com',
      'plus.unsplash.com',
      'images.unsplash.com',
      'aakash2330-drippy.s3.amazonaws.com',
      "s3.amazonaws.com",
    ],
  }
};

export default config;
