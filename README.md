<div align="center">

<pre>
  ██████╗  ██████╗  ███████╗ ███╗   ██╗     ██████╗   █████╗  ██╗   ██╗
 ██╔═══██╗ ██╔══██╗ ██╔════╝ ████╗  ██║     ██╔══██╗ ██╔══██╗ ╚██╗ ██╔╝
 ██║   ██║ ██████╔╝ █████╗   ██╔██╗ ██║     ██║  ██║ ███████║  ╚████╔╝ 
 ██║   ██║ ██╔═══╝  ██╔══╝   ██║╚██╗██║     ██║  ██║ ██╔══██║   ╚██╔╝  
 ╚██████╔╝ ██║      ███████╗ ██║ ╚████║     ██████╔╝ ██║  ██║    ██║   
  ╚═════╝  ╚═╝      ╚══════╝ ╚═╝  ╚═══╝     ╚═════╝  ╚═╝  ╚═╝    ╚═╝   
</pre>

</div>

# Open Day Portal

An interactive web portal for University's Computer Science or related Open Days. Features live Q&A, interactive CS demos, and admin management tools.

## Features

- **Live Q&A Board**: Real-time question submission and moderation with Firebase Firestore
- **Interactive Demos**:
  - Programming quiz game
  - Sorting algorithm visualizations
  - Maze generation
  - Pattern recognition
  - Object detection
  - Spinning wheel
- **Admin Dashboard**: Protected admin panel for content moderation
- **Multi-language Support**: i18n integration for Dutch/English
- **Responsive Design**: Mobile-friendly with dark gradient theme

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions, Hosting)
- **Testing**: Vitest + Testing Library
- **Fonts**: Domine (serif), Geist Mono (monospace)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Check TypeScript types

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── questions/         # Public Q&A board
│   ├── interactive/       # Programming quiz
│   └── [demos]/           # Various CS demos
├── components/            # React components
│   ├── app/              # App-specific components
│   ├── common/           # Shared components
│   ├── core/             # Layout components
│   └── ui/               # shadcn/ui primitives
├── lib/                  # Utilities and configurations
│   ├── firebase.ts       # Firebase setup
│   ├── i18n/            # Translations
│   └── data/            # Seed data
├── functions/            # Firebase Cloud Functions
└── public/              # Static assets
```

## Documentation

- [llms.txt](llms.txt) - Comprehensive project documentation for LLMs
- [STYLE.md](STYLE.md) - Design system and component guidelines

## Firebase Setup

This project uses Firebase for authentication and database. You'll need to:

1. Create a Firebase project
2. Enable Firestore and Authentication
3. Add your Firebase config to environment variables
4. Deploy Cloud Functions from the `functions/` directory

## Design System

The app uses a dark gradient theme with:

- Purple/slate gradient backgrounds with radial glows
- Emerald (`#10b981`) and blue (`#3b82f6`) accent colors
- Domine serif typography
- shadcn/ui component library

See [STYLE.md](STYLE.md) for complete design guidelines.

## Contributing

We welcome contributions! Please read our [Contributing Guide](.github/CONTRIBUTING.md) for detailed information on:

- Development workflow and setup
- Code standards and style guidelines
- Testing requirements
- Commit message conventions
- Pull request process
- Firebase development guidelines

**Quick Start for Contributors:**

```bash
# Fork and clone the repo, then:
npm install                # Install dependencies
npm run dev                # Start development server
npm run lint               # Check code style
npm run type-check         # Verify TypeScript
npm test                   # Run tests
```

Pre-commit hooks automatically run linting, type-checking, and formatting via Husky.

For design guidelines, see [STYLE.md](STYLE.md).

## TODO

Refactor into FINE architecture, make university agnostic (Currently made for LIACS (Leiden Institute of Advanced Computer Science))
