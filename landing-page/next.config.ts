import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
	defaultShowCopyCode: true,
});

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["nextra", "nextra-theme-docs"],
	// experimental: {
	// 	mdxRs: true,
	// },
};

export default withNextra(nextConfig);
