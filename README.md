# Starkwell - AI-driven Healthcare Cost Transparency Platform

A Next.js application for comparing healthcare costs and making informed healthcare decisions.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **SWR** for data fetching and caching
- **Server-Side Rendering (SSR)** support

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with SWR provider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer with links
│   ├── HeroSection.tsx     # Hero section
│   ├── SearchBar.tsx       # Search functionality
│   ├── ServiceButtons.tsx  # Service selection buttons
│   ├── FeatureBlocks.tsx   # Feature highlights
│   ├── Banner.tsx          # Banner section
│   ├── TransparencySection.tsx  # Transparency information
│   ├── EnterpriseSection.tsx    # Enterprise solutions
│   ├── StakeholderSolutions.tsx # Solutions for different stakeholders
│   ├── JoinTeamBanner.tsx       # Careers banner
│   └── ComparisonSection.tsx    # Cost comparison section
└── lib/
    └── swr-provider.tsx    # SWR configuration
```

## Technologies

- **Next.js 14**: React framework with SSR support
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **SWR**: Data fetching and caching library
- **Heroicons**: Icon library

## License

© 2024 Starkwell. All rights reserved.

