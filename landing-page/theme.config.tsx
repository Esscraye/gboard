import { Rocket } from "lucide-react";
// import type { DocsThemeConfig } from "nextra-theme-docs";

const config = {
	logo: (
		<div className="flex items-center gap-2">
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75" />
				<div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-1.5 rounded-lg">
					<Rocket className="w-5 h-5 text-white" />
				</div>
			</div>
			<span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				GBoard
			</span>
		</div>
	),
	project: {
		link: "https://github.com/your-repo/gboard",
	},
	docsRepositoryBase: "https://github.com/your-repo/gboard/tree/main/docs",
	footer: {
		text: (
			<span>
				© {new Date().getFullYear()}{" "}
				<a href="/" target="_blank" className="font-semibold" rel="noopener">
					GBoard
				</a>
				. Built with 💜 by the community.
			</span>
		),
	},
	useNextSeoProps() {
		return {
			titleTemplate: "%s – GBoard",
		};
	},
	head: (
		<>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta
				name="description"
				content="GBoard - Modern project management platform"
			/>
			<meta name="og:title" content="GBoard Documentation" />
		</>
	),
	primaryHue: 270,
	darkMode: true,
	nextThemes: {
		defaultTheme: "dark",
	},
};

export default config;
