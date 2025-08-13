# RULES.md - Strict Refactoring Guidelines

## MANDATORY: Code Quality Checks

**EVERY CHANGE MUST PASS:**

```bash
npm run type-check  # NO TypeScript errors allowed
npm run build       # MUST build successfully
npm run lint        # MUST pass linting
npm run test        # Tests should pass
```

## Architecture: Clean Architecture with Hexagonal/Ports & Adapters Pattern

### STRICT FOLDER STRUCTURE

```
app/                    # Next.js routes ONLY
├── (user)/            # User role routes
│   └── [userId]/      # Dynamic user routes
│       ├── dashboard/
│       ├── conversations/
│       ├── contacts/
│       ├── action-items/
│       ├── reminders/
│       └── preferences/
├── login/             # Public auth routes
└── api/               # API routes (minimal use)

components/            # React components ONLY
├── ui/               # Shadcn/Radix UI components ONLY
├── app/              # App-specific components (AudioRecorder, BusinessCardReader)
├── common/           # Shared components (Loading, ErrorBoundary, Skeleton)
└── core/             # Business UI components (ContactCard, TranscriptView)

core/                 # Business logic - NO EXTERNAL DEPENDENCIES
├── entities/         # Domain models
│   ├── recording.entity.ts
│   ├── transcript.entity.ts
│   ├── contact.entity.ts
│   ├── conversation.entity.ts
│   ├── action-item.entity.ts
│   └── user.entity.ts
├── workflows/        # Business operations
│   ├── process-recording.workflow.ts
│   ├── extract-business-card.workflow.ts
│   ├── generate-summary.workflow.ts
│   └── extract-action-items.workflow.ts
└── interfaces/       # Contracts for external services
    ├── IAuthProvider.ts
    ├── IStorageProvider.ts
    ├── ITranscriptionProvider.ts
    ├── IAIProvider.ts
    ├── IEmailProvider.ts
    ├── IDatabaseProvider.ts
    └── IAnalyticsProvider.ts

adapters/             # External service implementations
├── auth/
│   └── firebase-auth.adapter.ts
├── storage/
│   └── firebase-storage.adapter.ts
├── transcription/
│   └── assemblyai.adapter.ts
├── ai/
│   ├── openai.adapter.ts
│   └── prompts/
│       ├── summarization.prompts.ts
│       ├── action-extraction.prompts.ts
│       └── ocr-business-card.prompts.ts
├── email/
│   └── sendgrid.adapter.ts
├── database/
│   └── firestore.adapter.ts
└── analytics/
    └── firebase-analytics.adapter.ts

services/             # Orchestration layer
├── index.ts          # Service registry
├── auth.service.ts
├── conversation.service.ts
├── contact.service.ts
├── reminder.service.ts
└── analytics.service.ts

lib/                  # Utilities ONLY
├── config.ts         # Configuration constants
├── types.ts          # Shared TypeScript types
└── utils/            # Pure utility functions

hooks/                # React hooks
context/              # React contexts
functions/            # Firebase Cloud Functions
├── src/
│   ├── api/          # HTTP endpoints (onRequest)
│   │   ├── conversations.ts
│   │   ├── contacts.ts
│   │   ├── auth.ts
│   │   └── middleware.ts
│   ├── services/     # Business logic
│   ├── adapters/     # External services
│   ├── config/
│   │   └── secrets.ts
│   └── index.ts      # Exports only
└── lib/              # Compiled output
middleware.ts         # Next.js middleware
tests/
├── unit/
├── integration/
└── e2e/
```

## ABSOLUTE RULES - NO EXCEPTIONS

### 1. Dependency Rules

- **core/** CANNOT import from:
  - adapters/
  - services/
  - lib/config.ts
  - Any external packages (firebase, openai, etc.)
  - Any React/Next.js specific code
- **adapters/** CAN ONLY import from:
  - core/interfaces/
  - External packages they wrap
  - lib/config.ts (for configuration)
- **services/** CAN import from:
  - core/
  - adapters/
  - Other services
- **components/** CANNOT import from:
  - adapters/ (use services or hooks)
  - External service SDKs directly

### 2. Interface Rules

Every adapter MUST:

```typescript
// core/interfaces/IExampleProvider.ts
export interface IExampleProvider {
  // All methods return Promises
  // Use core entities as return types
  // No external types in signatures
}

// adapters/example/example.adapter.ts
export class ExampleAdapter implements IExampleProvider {
  // Implementation
}
```

### 3. Entity Rules

```typescript
// core/entities/example.entity.ts
export interface ExampleEntity {
  id: string;
  // Only primitive types and other entities
  // NO Firebase Timestamp, NO Date objects in interfaces
  createdAt: number; // Unix timestamp
}

export class Example implements ExampleEntity {
  // Class can have methods
  // NO external dependencies
}
```

### 4. Service Rules

```typescript
// services/example.service.ts
export class ExampleService {
  constructor(
    private authProvider: IAuthProvider,
    private dbProvider: IDatabaseProvider
  ) {}

  // Services orchestrate between core and adapters
  // Can contain business logic that spans multiple domains
}
```

### 5. Error Handling Rules

```typescript
// core/errors/
export class BusinessError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
  }
}

// Adapters convert external errors to BusinessError
// Services handle BusinessError
// Components display user-friendly messages
```

### 6. Testing Rules

- **unit/** - Test core/ in isolation
- **integration/** - Test adapters with REAL APIs using .env.local
- **e2e/** - Test full user flows
- **api/** - Test Firebase Functions with real HTTP requests

```bash
# .env.local (gitignored - contains production API keys for local testing)
ASSEMBLY_AI_KEY=your_production_key
OPENAI_API_KEY=your_production_key
SENDGRID_API_KEY=your_production_key

# Run tests locally before committing
npm run test

# CI/CD Pipeline
# GitHub Actions runs: format, lint, type-check, build
# Tests run locally only (API keys in .env.local)
```

### 7. Adding New Features

When adding a new external service:

1. Define interface in `core/interfaces/I[Service]Provider.ts`
2. Create adapter in `adapters/[service]/[service].adapter.ts`
3. Create or update service in `services/[domain].service.ts`
4. Update dependency injection in components/hooks

When adding a new business feature:

1. Define entities in `core/entities/`
2. Create workflows in `core/workflows/`
3. Create service in `services/`
4. Create UI components in `components/app/`

## File Naming Conventions

- **Entities**: `[name].entity.ts`
- **Workflows**: `[action]-[noun].workflow.ts`
- **Interfaces**: `I[Name]Provider.ts`
- **Adapters**: `[service].adapter.ts`
- **Services**: `[domain].service.ts`
- **Components**: PascalCase.tsx
- **Hooks**: `use[Feature].ts`

## TypeScript Rules

```typescript
// ALWAYS use explicit return types
function example(): string {}

// ALWAYS use interfaces for data contracts
interface Data {}

// PREFER composition over inheritance
// PREFER interfaces over types for objects
// NEVER use 'any' - use 'unknown' if needed
```

## Import Order

```typescript
// 1. React/Next.js
import { useState } from 'react';

// 2. External packages
import { z } from 'zod';

// 3. Core imports
import { IAuthProvider } from '@/core/interfaces/IAuthProvider';

// 4. Adapter imports
import { FirebaseAuthAdapter } from '@/adapters/auth/firebase-auth.adapter';

// 5. Service imports
import { AuthService } from '@/services/auth.service';

// 6. Component imports
import { Button } from '@/components/ui/button';

// 7. Relative imports
import { helper } from './helper';
```

## Refactoring Process

1. Create interfaces first
2. Create entities
3. Create adapter implementing interface
4. Create/update service
5. Update component imports
6. Run type-check and build
7. Update tests

## FORBIDDEN Practices

- NO direct Firebase imports in components
- NO business logic in adapters
- NO external types in core/
- NO console.log in production code
- NO unused imports
- NO circular dependencies
- NO default exports (except pages)
- NO emojis in code, comments, or UI text (use icons from lucide-react instead)

## Code Quality Anti-Patterns (ABSOLUTELY FORBIDDEN)

### Type Casting Hacks

```typescript
// ❌ FORBIDDEN - Lazy type "fixes"
const data = response as unknown as MyType;
const result = someFunction() as any;
// @ts-ignore
const value = problematicCode();

// ✅ CORRECT - Fix the actual types
interface APIResponse {
  data: MyType;
}
const response: APIResponse = await fetch();
const data = response.data;
```

### Try-Catch Abuse

```typescript
// ❌ FORBIDDEN - Multiple nested try-catch
try {
  try {
    const result = await operation();
  } catch (e) {
    try {
      const fallback = await backup();
    } catch (e2) {
      console.log('gave up');
    }
  }
} catch (e) {
  // wat
}

// ✅ CORRECT - Single try-catch with proper error handling
try {
  const result = await operation();
  return result;
} catch (error) {
  if (error instanceof NetworkError) {
    return await backup();
  }
  throw new BusinessError('Operation failed', 'OPERATION_ERROR');
}
```

### Type Widening

```typescript
// ❌ FORBIDDEN - Making types less strict to "fix" errors
interface User {
  name: string | undefined | null | any; // NO!
  email?: string | null | undefined; // NO!
}

// ✅ CORRECT - Strict types with proper handling
interface User {
  name: string;
  email: string;
}

// Handle nullish values at the boundary
function createUser(data: unknown): User {
  const validated = userSchema.parse(data);
  return {
    name: validated.name || 'Unknown',
    email: validated.email || '',
  };
}
```

### Solving Type Errors

When encountering type errors:

1. UNDERSTAND why the type error exists
2. FIX the root cause, not the symptom
3. If external API types are wrong, create proper type definitions
4. Use Zod schemas for runtime validation, not type assertions

```typescript
// ❌ FORBIDDEN - Quick fixes
const headers = req.headers as any;
const userId = (req as any).userId;

// ✅ CORRECT - Proper typing
interface AuthenticatedRequest extends Request {
  userId: string;
  headers: IncomingHttpHeaders & {
    authorization: string;
  };
}
```

## Git Commit Messages

```
refactor(auth): migrate to clean architecture
feat(adapter): add firebase auth adapter
fix(types): update entity interfaces
test(auth): add auth adapter unit tests
```

## Version Control Rules

- One feature per commit
- Run checks before committing
- No commits with failing builds
- Update tests with code changes

## Documentation Rules

```typescript
// Document ONLY:
// 1. Public APIs
// 2. Complex business logic
// 3. Non-obvious decisions

/**
 * Processes audio recording through transcription and AI analysis
 * @param audioUrl - Firebase Storage URL of the audio file
 * @returns Processed conversation with transcript and summary
 */
export interface ITranscriptionProvider {
  transcribe(audioUrl: string): Promise<Transcript>;
}

// NO redundant comments
// ❌ BAD: // This function gets the user
// ✅ GOOD: // Retries 3 times with exponential backoff
```

## Comments in Code

```typescript
// ALLOWED:
// TODO(2025-01-07): Refactor after auth migration - @username
// HACK: WorkAround for Firebase SDK bug - remove after v10
// NOTE: Rate limited to 100 requests per minute

// FORBIDDEN:
// Old commented code without context
// Obvious comments like "increment counter"
```

## Configuration & Secrets

### Frontend Config

```typescript
// lib/config.ts - Static configuration only
export const config = {
  app: {
    name: 'yuno',
    version: '1.0.0',
  },
  api: {
    functionsUrl: 'https://[project].cloudfunctions.net',
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxRecordingDuration: 300, // 5 minutes
  },
} as const;
```

### Backend Secrets (Firebase Functions)

```typescript
// functions/src/config/secrets.ts
import { defineSecret } from 'firebase-functions/v2';

export const secrets = {
  ASSEMBLY_AI_KEY: defineSecret('ASSEMBLY_AI_KEY'),
  OPENAI_API_KEY: defineSecret('OPENAI_API_KEY'),
  SENDGRID_API_KEY: defineSecret('SENDGRID_API_KEY'),
};

// Usage in functions
import { secrets } from './config/secrets';

export const processAudio = onRequest({ secrets: [secrets.ASSEMBLY_AI_KEY] }, async (req, res) => {
  const apiKey = secrets.ASSEMBLY_AI_KEY.value();
});
```

## Firebase Functions Patterns

### RESTful Endpoints

```typescript
// functions/src/api/conversations.ts
export const conversations = onRequest({ cors: ['https://yourdomain.com'] }, async (req, res) => {
  // Auth middleware
  const userId = await authenticateRequest(req);

  switch (req.method) {
    case 'GET':
      const id = req.query.id;
      return id ? getOne(userId, id) : getAll(userId);
    case 'POST':
      return create(userId, req.body);
    case 'PUT':
      return update(userId, req.query.id, req.body);
    case 'DELETE':
      return remove(userId, req.query.id);
    default:
      res.status(405).send('Method not allowed');
  }
});
```

### Secure Middleware

```typescript
// functions/src/api/middleware.ts
export async function authenticateRequest(req: Request): Promise<string> {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    throw new HttpError('No token provided', 401);
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken.uid;
}
```

### Error Handling in Functions

```typescript
// functions/src/utils/errors.ts
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

// Usage
try {
  const result = await operation();
  res.json({ success: true, data: result });
} catch (error) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Code Simplicity Rules

### Keep It Simple

```typescript
// ❌ OVERCOMPLICATED
class ConversationServiceFactory {
  private static instance: ConversationServiceFactory;
  private serviceCache: Map<string, ConversationService>;

  static getInstance(): ConversationServiceFactory {
    if (!this.instance) {
      this.instance = new ConversationServiceFactory();
    }
    return this.instance;
  }
  // ... 50 more lines
}

// ✅ SIMPLE
export const conversationService = new ConversationService(
  firestoreAdapter,
  assemblyAIAdapter,
  openAIAdapter
);
```

### Direct Solutions

```typescript
// ❌ OVERTHINKING
const processArray = (arr: any[]): string[] => {
  return arr
    .filter(x => x != null)
    .map(x => x?.toString?.() ?? '')
    .filter(x => x.length > 0);
};

// ✅ CLEAR INTENT
const getNonEmptyStrings = (items: unknown[]): string[] => {
  return items.filter((item): item is string => typeof item === 'string' && item.length > 0);
};
```

## Service Registry Pattern

```typescript
// services/index.ts - Central service registry
import { FirebaseAuthAdapter } from '@/adapters/auth/firebase-auth.adapter';
import { FirestoreAdapter } from '@/adapters/database/firestore.adapter';
import { AssemblyAIAdapter } from '@/adapters/transcription/assemblyai.adapter';
import { OpenAIAdapter } from '@/adapters/ai/openai.adapter';
import { AuthService } from './auth.service';
import { ConversationService } from './conversation.service';

// Simple singleton instances
const authAdapter = new FirebaseAuthAdapter();
const dbAdapter = new FirestoreAdapter();
const transcriptionAdapter = new AssemblyAIAdapter();
const aiAdapter = new OpenAIAdapter();

export const services = {
  auth: new AuthService(authAdapter, dbAdapter),
  conversation: new ConversationService(dbAdapter, transcriptionAdapter, aiAdapter),
  // Add other services as needed
} as const;

// hooks/useService.ts
export function useService<K extends keyof typeof services>(serviceName: K): (typeof services)[K] {
  return services[serviceName];
}
```

## PWA Considerations

```typescript
// hooks/usePWA.ts - Detect PWA mode
export function usePWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSPWA = window.navigator.standalone;
    setIsPWA(isStandalone || isIOSPWA);
  }, []);

  return isPWA;
}

// Different layouts for PWA vs Web
// PWA: Bottom navigation, touch-optimized
// Web: Traditional navbar, hover states
```

## Code Generation Guidelines

When generating code:

- Only provide code directly relevant to the request
- Follow existing coding style and patterns in the codebase
- Keep implementations simple, clean, and focused
- No unnecessary complexity or features beyond requirements
- Ask for clarification when requirements are ambiguous
- No speculation - work only with provided context

Example:

```typescript
// Request: "Add user authentication"
// ❌ DON'T: Add OAuth, 2FA, password reset, etc.
// ✅ DO: Basic email/password auth as specified
```

---

**THIS DOCUMENT IS LAW. NO EXCEPTIONS.**
