# Services Layer Documentation

This directory contains the service layer for the Climate Intelligence Network mobile app. The service layer provides a clean abstraction between the frontend components and backend operations (Supabase).

## Architecture Overview

```
services/
├── auth/                    # Authentication services
│   ├── auth.service.ts     # Core authentication operations
│   ├── oauth.service.ts    # OAuth provider integrations
│   └── index.ts           # Auth service exports
├── index.ts               # Main service exports
└── README.md             # This file
```

## Design Principles

### 1. **Separation of Concerns**
- **Frontend**: Pure UI/UX components, no direct backend calls
- **Services**: All backend operations and business logic
- **Types**: Shared interfaces and contracts

### 2. **Singleton Pattern**
Services use the singleton pattern to ensure single instances and consistent state management.

### 3. **Error Handling**
All service methods return a consistent error format with proper TypeScript typing.

### 4. **Platform Abstraction**
Services handle platform-specific differences (web vs mobile) internally.

## Available Services

### AuthService

Core authentication operations including sign in, sign up, password management, and session handling.

#### Usage Example
```typescript
import { authService } from '@/services';

// Sign in
const { error, session, user } = await authService.signIn({ 
  email: 'user@example.com', 
  password: 'password123' 
});

if (error) {
  console.error('Sign in failed:', error.message);
} else {
  console.log('Signed in successfully:', user?.email);
}
```

#### Available Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `signIn()` | Email/password authentication | `{ email, password }` | `{ error?, session?, user? }` |
| `signUp()` | User registration | `{ email, password, fullName? }` | `{ error?, session?, user?, needsVerification? }` |
| `signOut()` | User logout with cleanup | None | `{ error? }` |
| `getCurrentSession()` | Get current user session | None | `{ error?, session?, user? }` |
| `sendMagicLink()` | Passwordless authentication | `{ email, redirectTo? }` | `{ error? }` |
| `resetPassword()` | Password reset via email | `{ email, redirectTo? }` | `{ error? }` |
| `updatePassword()` | Update user password | `{ password }` | `{ error? }` |
| `verifyOtp()` | Verify OTP codes | `{ email, token, type }` | `{ error?, session?, user? }` |
| `resendVerification()` | Resend verification emails | `{ email, type?, redirectTo? }` | `{ error? }` |

### OAuthService

OAuth provider integrations for GitHub, Google, and other providers.

#### Usage Example
```typescript
import { oauthService } from '@/services';

// GitHub OAuth
const { error, url } = await oauthService.signInWithGitHub();

if (error) {
  console.error('GitHub OAuth failed:', error.message);
} else if (url) {
  // For web, redirect will happen automatically
  // For mobile, WebBrowser will handle the flow
}
```

#### Available Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `signInWithGitHub()` | GitHub OAuth flow | `redirectTo?` | `{ error?, url?, needsRedirect? }` |
| `exchangeGoogleCode()` | Google token exchange | `{ code, codeVerifier?, platform? }` | `{ access_token, refresh_token, error? }` |
| `createSessionFromUrl()` | Handle OAuth callbacks | `{ url, platform? }` | `{ error?, session?, user? }` |

## Type Safety

All services use strongly typed interfaces defined in `/types/auth.ts`. This ensures:

- **IntelliSense Support**: Full autocompletion in your IDE
- **Compile-time Checking**: Catch errors before runtime
- **Consistent APIs**: Same interface patterns across all services

## Error Handling

Services return errors in a consistent format:

```typescript
interface AuthResponse {
  error?: AuthError | Error | null;
}
```

Always check for errors before using the response data:

```typescript
const { error, session } = await authService.signIn({ email, password });

if (error) {
  // Handle error
  showErrorToast(error.message);
  return;
}

// Use session data
console.log('User signed in:', session.user.email);
```

## Platform Handling

Services automatically handle platform differences:

### Web Platform
- Uses `localStorage` for session storage
- Handles URL-based OAuth redirects
- Supports browser-specific cleanup

### Mobile Platform
- Uses `AsyncStorage` for session storage
- Handles deep link OAuth flows
- Supports native WebBrowser for OAuth

## Best Practices

### 1. **Always Use Services**
```typescript
// ❌ Don't do this in components
import { supabase } from '@/lib/supabase';
const { data } = await supabase.auth.signIn(/* ... */);

// ✅ Do this instead
import { authService } from '@/services';
const { error, session } = await authService.signIn(/* ... */);
```

### 2. **Handle Errors Properly**
```typescript
// ❌ Don't ignore errors
const { session } = await authService.signIn({ email, password });

// ✅ Always check for errors
const { error, session } = await authService.signIn({ email, password });
if (error) {
  handleAuthError(error);
  return;
}
```

### 3. **Use TypeScript**
```typescript
// ✅ Let TypeScript guide you
const request: SignInRequest = { email, password };
const response: SignInResponse = await authService.signIn(request);
```

## Testing

Services can be easily mocked for testing:

```typescript
// Mock the auth service
jest.mock('@/services', () => ({
  authService: {
    signIn: jest.fn().mockResolvedValue({ 
      session: mockSession, 
      user: mockUser 
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
}));
```

## Extending Services

To add new functionality:

1. **Define Types**: Add interfaces to `/types/auth.ts`
2. **Implement Method**: Add to the appropriate service class
3. **Export**: Update the index files
4. **Document**: Update this README

### Example: Adding a new method
```typescript
// 1. Add type in /types/auth.ts
export interface UpdateProfileRequest {
  fullName?: string;
  avatar?: string;
}

// 2. Add method to AuthService
async updateProfile({ fullName, avatar }: UpdateProfileRequest): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatar }
    });
    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}
```

## Migration Guide

If you're migrating from direct Supabase usage:

### Before
```typescript
import { supabase } from '@/lib/supabase';

const handleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    setError(error.message);
  } else {
    setUser(data.user);
  }
};
```

### After
```typescript
import { authService } from '@/services';

const handleSignIn = async () => {
  const { error, user } = await authService.signIn({ email, password });
  
  if (error) {
    setError(error.message);
  } else {
    setUser(user);
  }
};
```

## Support

For questions or issues with the service layer:

1. Check this documentation
2. Review the TypeScript interfaces in `/types/auth.ts`
3. Look at existing usage in `/context/auth.tsx`
4. Create an issue with detailed reproduction steps

---

*This service layer provides a solid foundation for scalable, maintainable authentication in your React Native app.*
