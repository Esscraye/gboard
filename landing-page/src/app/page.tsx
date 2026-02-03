"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	CheckCircle2,
	Code,
	Database,
	Github,
	Rocket,
	Sparkles,
	Star,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.3,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { type: "spring" as const, stiffness: 100 },
	},
};

const buttonVariants = {
	hover: {
		scale: 1.05,
		transition: { type: "spring" as const, stiffness: 400, damping: 10 },
	},
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
			{/* Animated Background Effects */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
				<div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/5 to-transparent rounded-full blur-2xl animate-float" />
			</div>

			{/* Navigation */}
			<motion.nav
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<motion.div
							className="flex items-center space-x-3"
							whileHover={{ scale: 1.02 }}
						>
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75" />
								<div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
									<Rocket className="w-6 h-6 text-white" />
								</div>
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
								GBoard
							</span>
						</motion.div>
						<div className="hidden md:flex items-center space-x-8">
							<Link
								href="#features"
								className="text-gray-300 hover:text-white transition-colors relative group"
							>
								Features
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
							</Link>
							<Link
								href="#tech"
								className="text-gray-300 hover:text-white transition-colors relative group"
							>
								Technology
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
							</Link>
							<Link
								href="/docs"
								className="text-gray-300 hover:text-white transition-colors relative group"
							>
								Docs
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
							</Link>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									asChild
									className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
								>
									<Link
										href="https://github.com/your-repo/gboard"
										className="flex items-center gap-2"
									>
										<Github className="w-4 h-4" />
										GitHub
									</Link>
								</Button>
							</motion.div>
						</div>
					</div>
				</div>
			</motion.nav>

			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				className="relative pt-32 pb-24 px-4"
			>
				<div className="max-w-7xl mx-auto text-center relative z-10">
					{/* Badge */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 20,
							delay: 0.4,
						}}
						className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm"
					>
						<Sparkles className="w-4 h-4 text-purple-400" />
						<span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
							Open Source Project Management
						</span>
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
					>
						<span className="text-white">Build Better</span>
						<br />
						<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
							Ship Faster
						</span>
					</motion.h1>

					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
					>
						The modern project management platform{" "}
						<span className="text-purple-400 font-semibold">
							built by developers
						</span>
						, for developers. Powerful, fast, and completely open source.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
					>
						<motion.div variants={buttonVariants} whileHover="hover">
							<Button
								asChild
								size="lg"
								className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl border-0 shadow-lg shadow-purple-500/25"
							>
								<Link href="/docs" className="flex items-center gap-2">
									Get Started Free
									<ArrowRight className="ml-1 w-5 h-5" />
								</Link>
							</Button>
						</motion.div>
						<motion.div variants={buttonVariants} whileHover="hover">
							<Button
								asChild
								size="lg"
								variant="outline"
								className="px-8 py-6 text-lg rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
							>
								<Link href="#demo" className="flex items-center gap-2">
									<Zap className="w-5 h-5 text-purple-400" />
									View Demo
								</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
					>
						{[
							{ value: "100%", label: "Open Source" },
							{ value: "⚡", label: "Lightning Fast" },
							{ value: "∞", label: "Unlimited Projects" },
							{ value: "🔒", label: "Secure by Default" },
						].map((stat, idx) => (
							<motion.div
								key={stat.label}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.9 + idx * 0.1 }}
								className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 backdrop-blur-sm"
							>
								<div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
									{stat.value}
								</div>
								<div className="text-sm text-gray-400">{stat.label}</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.section>

			{/* Features Section */}
			<motion.section
				id="features"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="relative py-24 px-4"
			>
				<div className="max-w-7xl mx-auto">
					<motion.div variants={itemVariants} className="text-center mb-16">
						<span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-4">
							FEATURES
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Everything You Need
							<br />
							<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
								And More
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Powerful features designed to supercharge your team's productivity
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								icon: Code,
								title: "Modern Tech Stack",
								description:
									"Built with Go backend and Next.js frontend for blazing-fast performance and incredible developer experience.",
								gradient: "from-blue-500 to-cyan-500",
								bgGradient: "from-blue-500/10 to-cyan-500/10",
							},
							{
								icon: Users,
								title: "Team Collaboration",
								description:
									"Real-time updates, comments, and @mentions keep your entire team aligned and moving forward.",
								gradient: "from-purple-500 to-pink-500",
								bgGradient: "from-purple-500/10 to-pink-500/10",
							},
							{
								icon: Database,
								title: "GraphQL API",
								description:
									"Flexible and efficient API that delivers exactly the data you need with zero overhead.",
								gradient: "from-green-500 to-emerald-500",
								bgGradient: "from-green-500/10 to-emerald-500/10",
							},
							{
								icon: Zap,
								title: "Kanban Boards",
								description:
									"Beautiful drag-and-drop boards with customizable columns to visualize your workflow perfectly.",
								gradient: "from-yellow-500 to-orange-500",
								bgGradient: "from-yellow-500/10 to-orange-500/10",
							},
							{
								icon: Rocket,
								title: "Lightning Fast",
								description:
									"Optimized for speed with sub-100ms response times and real-time synchronization across devices.",
								gradient: "from-red-500 to-pink-500",
								bgGradient: "from-red-500/10 to-pink-500/10",
							},
							{
								icon: CheckCircle2,
								title: "Easy Setup",
								description:
									"Get started in minutes with Docker, comprehensive docs, and seamless integration with your tools.",
								gradient: "from-indigo-500 to-purple-500",
								bgGradient: "from-indigo-500/10 to-purple-500/10",
							},
						].map((feature) => (
							<motion.div
								key={feature.title}
								variants={itemVariants}
								whileHover={{
									y: -8,
									transition: { type: "spring", stiffness: 300 },
								}}
								className="group relative"
							>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
								/>
								<div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 h-full hover:border-purple-500/40 transition-all duration-300">
									<div
										className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
									>
										<feature.icon className="w-7 h-7 text-white" />
									</div>
									<h3 className="text-2xl font-bold text-white mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* Tech Stack Section */}
			<motion.section
				id="tech"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="relative py-24 px-4"
			>
				<div className="max-w-7xl mx-auto">
					<motion.div variants={itemVariants} className="text-center mb-16">
						<span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-4">
							TECHNOLOGY
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Built With{" "}
							<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
								Modern Tools
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Leveraging the best technologies for maximum performance
						</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Left Column - Tech Stack Cards */}
						<motion.div variants={itemVariants} className="space-y-4">
							{[
								{ label: "Backend", value: "Go + GraphQL", icon: Code },
								{
									label: "Frontend",
									value: "Next.js + TypeScript",
									icon: Rocket,
								},
								{
									label: "Database",
									value: "PostgreSQL / SQLite",
									icon: Database,
								},
								{ label: "Auth", value: "JWT Tokens", icon: CheckCircle2 },
							].map((tech) => (
								<motion.div
									key={tech.label}
									whileHover={{ scale: 1.02, x: 10 }}
									className="group relative"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<div className="relative flex items-center justify-between p-6 bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all">
										<div className="flex items-center gap-4">
											<div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
												<tech.icon className="w-5 h-5 text-white" />
											</div>
											<span className="text-gray-400 text-lg">
												{tech.label}
											</span>
										</div>
										<span className="text-white font-bold text-lg">
											{tech.value}
										</span>
									</div>
								</motion.div>
							))}
						</motion.div>

						{/* Right Column - Why Choose */}
						<motion.div
							variants={itemVariants}
							className="relative group h-full"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-50" />
							<div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 h-full">
								<h3 className="text-2xl font-bold text-white mb-6">
									Why These Technologies?
								</h3>
								<div className="space-y-4">
									{[
										{
											title: "Performance First",
											desc: "Go's concurrency model handles thousands of requests effortlessly",
										},
										{
											title: "Developer Experience",
											desc: "TypeScript and GraphQL provide type safety end-to-end",
										},
										{
											title: "Production Ready",
											desc: "Battle-tested stack used by companies worldwide",
										},
										{
											title: "Open Source",
											desc: "Built on open standards with an active community",
										},
									].map((item) => (
										<div key={item.title} className="flex gap-3">
											<CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />{" "}
											<div>
												<h4 className="text-white font-semibold mb-1">
													{item.title}
												</h4>
												<p className="text-gray-400 text-sm">{item.desc}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</motion.section>

			{/* CTA Section */}
			<motion.section
				id="demo"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="relative py-24 px-4"
			>
				<div className="max-w-5xl mx-auto text-center">
					<motion.div variants={itemVariants} className="relative group">
						<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
						<div className="relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-12 md:p-16 backdrop-blur-sm">
							<motion.div
								initial={{ scale: 0.9 }}
								whileInView={{ scale: 1 }}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-8"
							>
								<Sparkles className="w-4 h-4 text-purple-400" />
								<span className="text-sm font-semibold text-purple-300">
									Ready to get started?
								</span>
							</motion.div>

							<h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
								Transform Your
								<br />
								<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
									Workflow Today
								</span>
							</h2>
							<p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
								Join thousands of teams already using GBoard. Free forever, open
								source, and ready to deploy in minutes.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
								<motion.div variants={buttonVariants} whileHover="hover">
									<Button
										asChild
										size="lg"
										className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl border-0 shadow-lg font-bold"
									>
										<Link href="/docs" className="flex items-center gap-2">
											Start Building Now
											<ArrowRight className="ml-1 w-5 h-5" />
										</Link>
									</Button>
								</motion.div>
								<motion.div variants={buttonVariants} whileHover="hover">
									<Button
										asChild
										size="lg"
										variant="outline"
										className="px-8 py-6 text-lg rounded-xl bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
									>
										<Link
											href="https://github.com/your-repo/gboard"
											className="flex items-center gap-2"
										>
											<Github className="w-5 h-5" />
											View on GitHub
										</Link>
									</Button>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.section>

			{/* Footer */}
			<motion.footer
				initial={{ y: 20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="relative border-t border-purple-500/20 bg-slate-950/50 backdrop-blur-sm"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						{/* Brand */}
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center gap-3 mb-4">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75" />
									<div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
										<Rocket className="w-5 h-5 text-white" />
									</div>
								</div>
								<span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
									GBoard
								</span>
							</div>
							<p className="text-gray-400 max-w-sm mb-4">
								The modern, open-source project management platform built by
								developers, for developers.
							</p>
							<div className="flex gap-3">
								<a
									href="https://github.com/your-repo/gboard"
									className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
								>
									<Github className="w-5 h-5 text-gray-400" />
								</a>
								<a
									href="/"
									className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
								>
									<Star className="w-5 h-5 text-gray-400" />
								</a>{" "}
							</div>
						</div>

						{/* Links */}
						<div>
							<h4 className="text-white font-semibold mb-4">Product</h4>
							<ul className="space-y-2">
								{["Features", "Pricing", "Roadmap", "Changelog"].map((item) => (
									<li key={item}>
										<Link
											href="/"
											className="text-gray-400 hover:text-white transition-colors"
										>
											{item}
										</Link>{" "}
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="text-white font-semibold mb-4">Resources</h4>
							<ul className="space-y-2">
								{["Documentation", "API", "Support", "Community"].map(
									(item) => (
										<li key={item}>
											<Link
												href="/"
												className="text-gray-400 hover:text-white transition-colors"
											>
												{item}
											</Link>{" "}
										</li>
									),
								)}
							</ul>
						</div>
					</div>

					<div className="pt-8 border-t border-purple-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-gray-400 text-sm">
							© {new Date().getFullYear()} GBoard. All rights reserved. Built
							with 💜 by the community.
						</p>
						<div className="flex gap-6 text-sm">
							<Link
								href="/"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Privacy
							</Link>
							<Link
								href="/"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Terms
							</Link>
							<Link
								href="/"
								className="text-gray-400 hover:text-white transition-colors"
							>
								License
							</Link>
						</div>
					</div>
				</div>
			</motion.footer>
		</div>
	);
}
