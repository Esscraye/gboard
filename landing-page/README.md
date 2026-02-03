# GBoard Landing Page & Documentation

This is the landing page and documentation site for GBoard, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Landing Page**: Beautiful, animated landing page with Framer Motion
- **Documentation**: Powered by Nextra for easy documentation management
- **Type Safety**: Built with TypeScript
- **Styling**: Tailwind CSS for rapid UI development
- **Linting**: Biome.js for code quality (instead of ESLint)
- **Animations**: Framer Motion for smooth, engaging animations
- **Performance**: Uses Bun for faster package management and execution

## Getting Started

### Prerequisites

- Node.js v18+ or Bun
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies with Bun (recommended)
bun install
```

### Development

```bash
# Start the development server
bun run dev

# Start the documentation server on port 3001
bun run docs:dev
```

### Building for Production

```bash
# Build the application
bun run build

# Start the production server
bun run start
```

### Code Quality

```bash
# Check code with Biome
bun run lint

# Format code with Biome
bun run format
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── page.tsx       # Landing page
│   └── layout.tsx     # Root layout
├── docs/             # Documentation (Nextra)
│   └── index.mdx      # Main documentation
├── components/       # Reusable components
│   └── ui/           # UI components (Button, etc.)
└── lib/              # Utility functions
    └── utils.ts       # Helper functions
```

## Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Documentation**: Nextra
- **Linting**: Biome.js
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives
- **Package Manager**: Bun (faster alternative to npm/yarn/pnpm)

## Deployment

This application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Next.js app
3. Deploy with zero configuration

### Environment Variables

Create a `.env.local` file for environment variables:

```
# Next.js environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Customization

### Colors

Edit the Tailwind CSS configuration in `tailwind.config.ts` to customize the color scheme.

### Content

- Edit `src/app/page.tsx` for the landing page content
- Edit `src/docs/` for documentation content
- Update `theme.config.tsx` for documentation theme settings

### Branding

Update the logo and branding in:
- `src/app/page.tsx` (landing page header)
- `theme.config.tsx` (documentation logo)

## Bun Configuration

This project uses [Bun](https://bun.sh/) as the package manager for improved performance:

- **Faster installs**: Bun is significantly faster than npm/yarn/pnpm
- **Optimized runs**: Commands execute faster with Bun
- **Configuration**: See `.bunfig.toml` for Bun-specific settings

To install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run format` to format code
5. Run `bun run lint` to check code quality
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ by the GBoard team