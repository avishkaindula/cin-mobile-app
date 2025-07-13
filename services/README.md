# Services Architecture

This document outlines the new service layer architecture that separates backend operations from frontend components.

## Overview

The service layer provides a clean abstraction between the frontend components and the Supabase backend, following industry best practices for maintainable and scalable code architecture.

## Directory Structure

```
services/
├── auth/
│   ├── auth.service.ts      # Core authentication operations
│   ├── oauth.service.ts     # OAuth provider integrations
│   └── index.ts            # Service exports
├── index.ts                # Main service exports
types/
├── auth.ts                 # Authentication type definitions
└── index.ts               # Type exports
```

## Benefits

### 🏗️ **Separation of Concerns**
- Frontend components focus on UI/UX
- Services handle all backend operations
- Clear separation between presentation and business logic

### 🔧 **Maintainability**
- Centralized backend logic
- Easy to update/modify service implementations
- Consistent error handling across the app

### 🧪 **Testability**
- Services can be easily mocked for testing
- Business logic is isolated and testable
- Better unit test coverage

### 📚 **Developer Experience**
- Frontend developers don't need to know Supabase details
- Clear, documented API for all backend operations
- Type-safe operations with TypeScript

## Usage

### Authentication Service

```typescript
import { authService } from '@/services';

// Sign in
const result = await authService.signIn({ email, password });
if (result.error) {
  // Handle error
} else {
  // Success - user is signed in
}

// Sign up
const result = await authService.signUp({ 
  email, 
  password, 
  fullName 
}, redirectUrl);

// Update password
const result = await authService.updatePassword({ password });
```

### OAuth Service

```typescript
import { oauthService } from '@/services';

// GitHub OAuth
const result = await oauthService.signInWithGitHub({
  redirectTo: 'your-redirect-url'
});

// Create session from OAuth URL
const result = await oauthService.createSessionFromUrl(url);
```

## Available Services

### AuthService

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `signIn()` | Email/password login | `SignInCredentials` | `AuthResult` |
| `signUp()` | Create new account | `SignUpCredentials, redirectTo?` | `AuthResult` |
| `signOut()` | Sign out user | None | `{ error?: Error }` |
| `getCurrentSession()` | Get current session | None | `{ session, error }` |
| `sendMagicLink()` | Send passwordless login link | `MagicLinkRequest, redirectTo?` | `AuthResult` |
| `resetPassword()` | Send password reset email | `PasswordResetRequest, redirectTo?` | `AuthResult` |
| `updatePassword()` | Update user password | `PasswordUpdateRequest` | `AuthResult` |
| `verifyOtp()` | Verify OTP code | `OTPVerification` | `AuthResult` |
| `resendVerification()` | Resend verification email | `ResendVerificationRequest, redirectTo?` | `AuthResult` |

### OAuthService

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `signInWithGitHub()` | GitHub OAuth login | `OAuthOptions?` | `AuthResult` |
| `createSessionFromUrl()` | Handle OAuth callback | `url: string` | `AuthResult` |
| `exchangeGoogleCode()` | Exchange Google auth code | `code, codeVerifier?, baseUrl?` | `AuthResult` |

## Types

All service methods use strongly typed interfaces defined in `/types/auth.ts`:

- `AuthResult` - Standard return type for auth operations
- `SignInCredentials` - Email/password login data
- `SignUpCredentials` - Registration data
- `OTPVerification` - OTP verification data
- `PasswordResetRequest` - Password reset data
- `PasswordUpdateRequest` - Password update data
- And more...

## Migration Guide

If you have existing code that directly imports and uses Supabase:

### Before
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### After
```typescript
import { authService } from '@/services';

const { error, session, user } = await authService.signIn({ 
  email, 
  password 
});
```

## Best Practices

1. **Always use services** - Never import `supabase` directly in components
2. **Handle errors consistently** - All service methods return error information
3. **Use TypeScript** - Leverage the type definitions for better development experience
4. **Keep services focused** - Each service should handle a specific domain (auth, data, etc.)

## Adding New Services

When adding new backend functionality:

1. Create a new service file in the appropriate directory
2. Define types in `/types/`
3. Export from service index files
4. Document the API in this README

Example:
```typescript
// services/data/posts.service.ts
class PostsService {
  async createPost(data: CreatePostRequest): Promise<PostResult> {
    // Implementation
  }
}

export const postsService = new PostsService();
```

This architecture ensures scalable, maintainable, and developer-friendly code organization.
