# Hooks (ViewModel layer in MVVM)

Custom React hooks that manage application state and business logic using composition patterns.

## Architecture

### Composition Pattern
Complex functionality is built by composing smaller, focused hooks:
- **Main hooks** (useAuth, useSearch) compose multiple sub-hooks
- **Sub-hooks** handle specific responsibilities
- **Utilities** provide shared logic across hooks

### File Structure
```
hooks/
├── auth/                   # Authentication hooks
│   ├── index.ts           # Clean exports
│   ├── useAuth.ts         # Main auth hook (composed)
│   ├── useAuthState.ts    # Auth state management
│   ├── useAuthActions.ts  # Auth actions (composed)
│   ├── useAuthLogin.ts    # Login logic
│   ├── useAuthRegister.ts # Registration logic
│   ├── useAuthLogout.ts   # Logout logic
│   └── useAuthValidation.ts # Form validation
├── search/                # Search hooks
│   ├── index.ts           # Clean exports
│   ├── useSearch.ts       # Main search hook (composed)
│   ├── useSearchData.ts   # API data fetching
│   ├── useSearchState.ts  # Search state management
│   ├── useSearchFilter.ts # Filtering logic
│   └── useSearchSort.ts   # Sorting logic
├── tools/                 # Tool management hooks
│   ├── index.ts           # Clean exports
│   └── useYourTools.ts    # User tools management
├── utils/                 # Shared utilities
│   ├── index.ts           # Clean exports
│   └── searchUtils.ts     # Common search logic
├── index.ts               # Main hooks index
└── readme.txt             # This documentation
```

## Files:

### Authentication Hooks

#### useAuth.ts (Main Hook)
- **Purpose**: Main authentication hook that combines state and actions
- **Features**: 
  - Combines useAuthState and useAuthActions
  - Provides unified interface for authentication
  - Backward compatible with existing code
- **Used by**: Navbar, Dashboard, Login, CreateAccount, YourTools pages

#### useAuthState.ts
- **Purpose**: Manages global authentication state and localStorage synchronization
- **Features**:
  - Global state management across components
  - JWT token persistence
  - Automatic state initialization from localStorage
- **Used by**: useAuth hook

#### useAuthActions.ts (Composed)
- **Purpose**: Handles authentication actions with error management
- **Features**:
  - Combines useAuthLogin, useAuthRegister, useAuthLogout
  - Error handling and loading states
  - Form validation integration
- **Used by**: useAuth hook

#### useAuthLogin.ts
- **Purpose**: Handles login logic only
- **Features**:
  - Login API calls
  - Token storage
  - State updates
- **Used by**: useAuthActions hook

#### useAuthRegister.ts
- **Purpose**: Handles registration logic only
- **Features**:
  - Registration API calls
  - Error handling
- **Used by**: useAuthActions hook

#### useAuthLogout.ts
- **Purpose**: Handles logout logic only
- **Features**:
  - Token removal
  - State cleanup
- **Used by**: useAuthActions hook

#### useAuthValidation.ts
- **Purpose**: Handles form validation for authentication
- **Features**:
  - Login form validation
  - Registration form validation
  - Password confirmation validation
- **Used by**: useAuthLogin, useAuthRegister hooks

### Search Hooks

#### useSearch.ts (Main Hook - Composed)
- **Purpose**: Main search hook that composes data, filtering, and sorting
- **Features**:
  - Combines useSearchData, useSearchState, useSearchFilter, useSearchSort
  - Tool search with relevance scoring
  - Multiple sort options (price, alphabetical, relevance)
  - Real-time filtering
  - Loading and error states
- **Used by**: SearchPage component

#### useSearchData.ts
- **Purpose**: Handles API data fetching for search
- **Features**:
  - API integration
  - Default image handling
  - Error handling
- **Used by**: useSearch hook

#### useSearchState.ts
- **Purpose**: Manages search state (query, sort)
- **Features**:
  - State management with callbacks
- **Used by**: useSearch hook

#### useSearchFilter.ts
- **Purpose**: Handles tool filtering based on query
- **Features**:
  - Real-time filtering
  - Uses shared searchUtils
- **Used by**: useSearch hook

#### useSearchSort.ts
- **Purpose**: Handles tool sorting (relevance, price, alphabetical)
- **Features**:
  - Multiple sort options
  - Relevance scoring
  - Uses shared searchUtils
- **Used by**: useSearch hook

### Tool Management Hooks

#### useYourTools.ts
- **Purpose**: Manages user's personal tools and filtering
- **Features**:
  - Fetches user's owned tools
  - Search within user's tools
  - Relevance-based sorting
  - Authentication-aware data fetching
  - Uses shared searchUtils
- **Used by**: YourTools page

### Shared Utilities

#### utils/searchUtils.ts
- **Purpose**: Shared utilities for search functionality
- **Functions**:
  - getRelevanceScore(tool, query) - Calculate relevance score
  - filterTools(tools, query) - Filter tools based on query
- **Used by**: useSearch, useYourTools hooks

## Import Options

### Option 1: Category-based imports (Recommended)
```tsx
import { useAuth } from '../hooks/auth';
import { useSearch } from '../hooks/search';
import { useYourTools } from '../hooks/tools';
```

### Option 2: Main index import
```tsx
import { useAuth, useSearch, useYourTools } from '../hooks';
```

### Option 3: Specific file imports
```tsx
import { useAuth } from '../hooks/auth/useAuth';
import { useSearchData } from '../hooks/search/useSearchData';
```

## Benefits of This Architecture

### Maintainability
- Each hook has a single responsibility
- Easy to find and fix issues
- Clear separation of concerns

### Testability
- Individual hooks can be tested in isolation
- Shared utilities can be unit tested
- Mock dependencies easily

### Reusability
- Hooks can be reused across components
- Shared utilities prevent code duplication
- Consistent interfaces across the app

### Performance
- Optimized re-renders with proper memoization
- Efficient dependency management
- Minimal API calls