import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	output: "export",
	assetPrefix: isProd ? "/docmorph/" : "",
	basePath: isProd ? "/docmorph" : "",
	images: {
		unoptimized: true, // Required for static export
	},
	trailingSlash: true,
	// Note: Removed esmExternals as it's not compatible with Turbopack
	// Client-side libraries should work without this in modern Next.js
};

export default nextConfig;
