# Contributing to LIACS Open Day Portal

Thank you for your interest in contributing to the LIACS Open Day Portal! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project adheres to a code of professional conduct. By participating, you are expected to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility and apologize when mistakes are made
- Prioritize what's best for the community and the project

## Getting Started

### Prerequisites

- **Node.js**: v20 or higher (v22 recommended)
- **npm**: v9 or higher
- **Git**: Latest version
- **Firebase Account**: For testing backend features (optional for frontend work)

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/liacs-openday.git
   cd liacs-openday
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/behrad/liacs-openday.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment variables** (if needed):

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase config
   ```

6. **Start the development server**:

   ```bash
   npm run dev
   ```

7. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Before Starting Work

1. **Sync with upstream**:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

### Branch Naming Convention

- **Features**: `feature/description`
- **Bug fixes**: `fix/description`
- **Documentation**: `docs/description`
- **Performance**: `perf/description`
- **Refactoring**: `refactor/description`
- **Tests**: `test/description`

Examples:

- `feature/add-question-filter`
- `fix/admin-auth-redirect`
- `docs/update-style-guide`

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
├── test/                 # Unit and integration tests
├── functions/            # Firebase Cloud Functions
├── public/              # Static assets
└── .github/             # GitHub workflows and templates
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new files
- **Enable strict mode**: The project uses strict TypeScript settings
- **Define types explicitly** for function parameters and return values
- **Avoid `any`**: Use proper types or `unknown` if necessary

### React

- **Use functional components** with hooks
- **Prefer named exports** for components
- **Use `'use client'`** directive when needed for client components
- **Keep components small** and focused on a single responsibility

### Styling

- **Use Tailwind CSS** utilities
- **Follow the design system** defined in [STYLE.md](STYLE.md)
- **Use semantic color names**: `text-leiden`, `text-science`, etc.
- **Responsive design**: Mobile-first approach using Tailwind breakpoints

### Code Organization

- **Group imports** in this order:
  1. React/Next.js imports
  2. External libraries
  3. Internal components
  4. Utilities and types
  5. Styles

Example:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import type { Question } from '@/types/question';
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Writing Tests

- **Write tests** for all new features and bug fixes
- **Test file naming**: `ComponentName.test.tsx` or `utility.test.ts`
- **Place tests** in the `test/` directory mirroring the source structure
- **Aim for high coverage** but prioritize meaningful tests over coverage metrics

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Guidelines

- **Unit tests**: Test individual functions and components in isolation
- **Integration tests**: Test component interactions and data flow
- **Mock external dependencies**: Use Vitest mocks for Firebase, API calls, etc.
- **Test user interactions**: Use `@testing-library/user-event` for realistic interactions
- **Accessibility**: Include tests for ARIA labels and keyboard navigation

## Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes
- `ci`: CI/CD changes

**Examples:**

```bash
feat(questions): add real-time question filtering
fix(admin): resolve authentication redirect loop
docs(readme): update installation instructions
test(utils): add tests for cn utility function
```

### Best Practices

- **Keep commits atomic**: One logical change per commit
- **Write clear messages**: Explain what and why, not how
- **Reference issues**: Include issue numbers when relevant (e.g., `Fixes #123`)
- **Sign your commits**: Use `git commit -s` (optional but encouraged)

## Pull Request Process

### Before Submitting

1. **Ensure all checks pass**:

   ```bash
   npm run lint        # Run linter
   npm run format      # Format code
   npm run type-check  # Check TypeScript
   npm test            # Run tests
   npm run build       # Test production build
   ```

2. **Update documentation** if needed
3. **Add tests** for new features
4. **Update CHANGELOG** if applicable (for significant changes)

### Submitting a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub
3. **Fill out the PR template** completely
4. **Link related issues** (e.g., "Closes #123")
5. **Request review** from maintainers

### PR Title Format

Use the same format as commit messages:

```
feat(scope): add new feature
fix(scope): resolve bug
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged
```

### Review Process

- **Be responsive** to feedback and questions
- **Make requested changes** in new commits (don't force-push during review)
- **Resolve conversations** after addressing feedback
- **Wait for approval** from at least one maintainer
- **Squash commits** if requested before merging

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** and README
3. **Try the latest version** to see if the issue is already fixed

### Creating an Issue

- **Use issue templates** when available
- **Provide clear titles**: Describe the issue concisely
- **Include details**:
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior
  - Environment information
  - Screenshots or error logs
- **Be respectful** and professional

### Issue Labels

Issues will be labeled by maintainers:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `needs-triage`: Needs review by maintainers

## Firebase Development

### Functions Development

If working on Cloud Functions:

1. **Navigate to functions directory**:

   ```bash
   cd functions
   npm install
   ```

2. **Use Firebase emulators** for local testing:

   ```bash
   firebase emulators:start
   ```

3. **Test functions locally** before deploying

### Firestore Security Rules

- **Test security rules** using Firebase emulator
- **Document any rule changes** in PR description
- **Ensure rules follow principle of least privilege**

## Getting Help

- **GitHub Discussions**: Ask questions or discuss ideas
- **Issue Tracker**: Report bugs or request features
- **Documentation**: Check [llms.txt](llms.txt) and [STYLE.md](STYLE.md)
- **Pull Request Comments**: Ask questions during code review

## Recognition

Contributors will be recognized in:

- Git commit history
- GitHub contributors page
- Release notes (for significant contributions)

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to LIACS Open Day Portal!** 🎉

Your contributions help make this project better for everyone.
