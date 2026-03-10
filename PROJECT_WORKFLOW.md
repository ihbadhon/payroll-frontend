# Payroll Management System - Complete Workflow

## 📋 Table of Contents

1. [Application Initialization](#application-initialization)
2. [Authentication Flow](#authentication-flow)
3. [Protected Routes & Access Control](#protected-routes--access-control)
4. [Data Flow (API → Component)](#data-flow-api--component)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Session Management](#session-management)

---

## Application Initialization

### Step 1: App Startup Flow

```
index.html
    ↓
src/app/layout.tsx (Root Layout)
    ↓
    ├─→ Providers.tsx (Wraps everything with context)
    │   ├─→ QueryClientProvider (TanStack React Query)
    │   ├─→ ThemeProvider (Dark/Light mode)
    │   ├─→ AuthProvider (Authentication context)
    │   ├─→ Toaster (Toast notifications)
    │   └─→ ReactQueryDevtools (Dev tools)
    │
    └─→ middleware.ts runs on every request
        (Checks auth, validates routes, redirects to login)
```

### What Happens on Initial Load:

1. **Browser loads `/` or any route**
2. **Middleware intercepts** (`src/middleware.ts`):
   - Checks for `access_token` cookie
   - Checks for `user_role` cookie
   - If not authenticated → redirects to `/login`
   - If authenticated but unauthorized role → redirects to `/unauthorized`
3. **Providers wrap app** with:
   - **AuthProvider** → initializes auth state
   - **QueryClientProvider** → caches API data
4. **AuthContext mounts** and calls `refetchUser()`:
   - Reads `access_token` from cookies
   - Calls `GET /user/profile` to verify session
   - Updates auth state with user data
5. **AppShell component** (layout wrapper):
   - Shows `PageLoader` while `isLoading=true`
   - Once auth is ready, renders Sidebar + Header + Content

---

## Authentication Flow

### 1️⃣ Login Flow (User not authenticated)

```
User visits / or /dashboard
        ↓
Middleware blocks (no token)
        ↓
Redirects to /login?callbackUrl=/dashboard
        ↓
src/app/(auth)/login/page.tsx renders LoginForm
        ↓
User enters email + password
        ↓
LoginForm.tsx calls login() from auth.service.ts
        ↓
POST /auth/login {email, password}
        ↓
Backend validates & returns:
{
  user: {
    id, name, email, role: {name, permissions},
    isVerified, isActive
  },
  accessToken: "jwt_token_here"
}
        ↓
setAccessToken(token):
  - Stores in cookie: js-cookie
  - 15-min expiration
  - Secure flag in production
        ↓
setUser(user):
  - Stores user in auth context
  - Stores role in cookie (for middleware)
        ↓
Router redirects to callbackUrl (/dashboard)
        ↓
AuthProvider.refetchUser() verifies user is still valid
        ↓
App loads with authenticated user
```

### Files Involved:

- **src/app/(auth)/login/LoginForm.tsx** - Form UI, validation
- **src/services/auth/auth.service.ts** - API call
- **src/store/auth.context.tsx** - Auth state management
- **src/lib/axios.ts** - HTTP client with interceptors

---

## Protected Routes & Access Control

### Middleware Flow (Happens before component renders)

```typescript
// src/middleware.ts runs on EVERY request

Request to /employees
        ↓
Step 1: Check if public route
  - /login ✓ public (skip auth)
  - /verify-email ✓ public (skip auth)
  - /unauthorized ✓ public (skip auth)
  - /employees ✗ NOT public (needs auth)
        ↓
Step 2: Check authentication
  - Read access_token from cookies
  - If NO token → redirect to /login?callbackUrl=/employees
  - If HAS token → continue
        ↓
Step 3: Role-based access control
  - Read user_role from cookie
  - Get allowed roles for /employees from permissions.ts
  - ROUTE_PERMISSIONS = [
      { prefix: "/employees", roles: ["Super Admin", "HR"] }
    ]
  - User role = "HR" → ✓ allowed
  - If role not allowed → redirect to /unauthorized
        ↓
Step 4: Allow request through
  - Page renders with authenticated user
  - useAuth() hook returns user context
```

### Protected Routes Map (from `src/config/permissions.ts`):

| Route               | Allowed Roles            | Purpose                    |
| ------------------- | ------------------------ | -------------------------- |
| `/users`            | Super Admin              | Manage users               |
| `/roles`            | Super Admin              | Manage roles               |
| `/audit-log`        | Super Admin              | View audit logs            |
| `/employees`        | Super Admin, HR          | Manage employees           |
| `/departments`      | Super Admin, HR          | Manage departments         |
| `/salary-structure` | Super Admin, HR          | Assign & approve salaries  |
| `/salary-rules`     | Super Admin, HR          | Configure salary rules     |
| `/payroll`          | Super Admin, HR, Finance | Generate & approve payroll |
| `/bonus`            | Super Admin, HR, Finance | Assign bonuses             |
| `/loans`            | Super Admin, HR, Finance | Approve loan requests      |
| `/dashboard`        | All authenticated        | View dashboard             |
| `/settings`         | All authenticated        | User settings              |

---

## Data Flow (API → Component)

### Example: AdminDashboard showing employee count

```
AdminDashboard.tsx
        ↓
useEmployeeCount() hook (src/hooks/useEmployees.ts)
        ↓
useQuery({
  queryKey: EMPLOYEE_KEYS.count,
  queryFn: () => getEmployeeCount()
})
        ↓
getEmployeeCount() service call
        ↓
api.get("/employee/count")
        ↓
Request Interceptor (src/lib/axios.ts):
  - Reads access_token from cookie
  - Adds header: Authorization: Bearer {token}
  - Sends request
        ↓
Backend API (GET /api/v1/employee/count)
        ↓
Response: { data: number }
        ↓
Response Interceptor:
  - If 401 (Unauthorized):
    - Tries to refetch token (POST /auth/refresh)
    - Re-sends original request with new token
    - If refresh fails → clears cookies & redirects to /login
  - If other error → rejects
  - If success → returns response
        ↓
Hook caches data in React Query
        ↓
Component renders: totalEmployees = 42
```

### React Query Flow:

```typescript
// First render
const { data, isLoading, isError } = useEmployeeCount();
// isLoading = true, data = undefined

// API request starts...
// While requesting
// isLoading = true

// Request completes
// isLoading = false, data = 42

// Component re-renders with data
```

---

## User Roles & Permissions

### 4 Available Roles:

1. **Super Admin**
   - Access to: Users, Roles, Audit Logs, Employees, Departments, Salary Rules, Salary Structure, Payroll, Bonus, Loans, Dashboard, Settings
   - Can: Create/edit all data, approve all changes, access audit logs

2. **HR (Human Resources)**
   - Access to: Employees, Departments, Salary Rules, Salary Structure, Payroll, Bonus, Loans, Dashboard, Settings
   - Can: Manage employees, assign salaries, submit bonus/loan requests

3. **Finance**
   - Access to: Payroll, Bonus, Loans, Dashboard, Settings
   - Can: Approve/reject payroll, manage loan approvals, process bonuses

4. **Employee**
   - Access to: Dashboard, Settings, My Loans, My Salary
   - Can: View personal salary, request loans, view loan status

### How Roles Work:

```typescript
// User logs in with email "john@example.com" → Role = "HR"

// Middleware stores:
// Cookie: user_role = "HR"

// When user visits /employees:
// config/permissions.ts checks:
//   "/employees" → allowed roles = ["Super Admin", "HR"]
//   user_role = "HR" ✓ allowed

// When user visits /users:
// config/permissions.ts checks:
//   "/users" → allowed roles = ["Super Admin"]
//   user_role = "HR" ✗ not allowed
//   Redirect to /unauthorized
```

---

## Session Management

### Token Lifecycle

```
Login
  ↓
POST /auth/login → receives accessToken (JWT)
  ↓
setAccessToken(token) stores in cookie with:
  - 15-minute expiration
  - Secure & HttpOnly flags in production
  - SameSite: "lax"
  ↓
Every API request automatically includes token in Authorization header
  ↓
Token valid for 15 minutes
  ↓
After 15 minutes (or token expires):
  - Next API request gets 401 Unauthorized
  - Response interceptor catches 401
  - Automatically POST /auth/refresh with refresh_token
  - Gets new accessToken from backend
  - Re-sends original request with new token
  ↓
User continues using app seamlessly (no re-login needed)
  ↓
If refresh token also expired:
  - Clear all cookies
  - Redirect to /login
  - User must log in again
```

### Cookie Storage:

```typescript
// src/lib/axios.ts & src/store/auth.context.tsx

Cookies.set(ACCESS_TOKEN_KEY, token, {
  secure: true, // HTTPS only in production
  sameSite: "lax", // CSRF protection
  expires: 1 / 96, // ~15 minutes
});

Cookies.set(USER_ROLE_KEY, role, {
  secure: true,
  sameSite: "lax", // No expiry - stored until logout
});
```

---

## Complete User Journey Map

```
┌─────────────────────────────────────────────────┐
│  ANONYMOUS USER                                  │
└──────────────────────┬──────────────────────────┘
                       │ Browser loads app
                       ↓
            ┌──────────────────────┐
            │  src/middleware.ts   │
            │  - Check for token   │
            │  - No token found    │
            └──────────────┬───────┘
                           │
                ┌──────────→ Redirect to /login
                │
                ↓
    ┌────────────────────────────────────────┐
    │  src/app/(auth)/login/page.tsx         │
    │  LoginForm.tsx                          │
    │  - Email input                          │
    │  - Password input                       │
    │  - Submit button                        │
    └────────────────┬───────────────────────┘
                     │ User enters credentials
                     ↓
    ┌────────────────────────────────────────┐
    │  auth.service.ts                        │
    │  POST /auth/login                       │
    └────────────────┬───────────────────────┘
                     │
                     ↓
           ┌─────────────────────────────┐
           │  Backend API                │
           │  /api/v1/auth/login         │
           │  Validates credentials      │
           │  Returns JWT token          │
           └────────────┬────────────────┘
                        │
                        ↓
    ┌───────────────────────────────────────────┐
    │  auth.context.tsx                         │
    │  - setAccessToken(jwt) → cookie           │
    │  - setUser(profile) → context + cookie    │
    │  - Router to /dashboard                   │
    └───────────────────┬───────────────────────┘
                        │
                        ↓
        ┌───────────────────────────────┐
        │  src/middleware.ts            │
        │  - Finds token ✓              │
        │  - Checks role ✓              │
        │  - Allows /dashboard ✓        │
        └───────────────┬───────────────┘
                        │
                        ↓
    ┌────────────────────────────────────────────┐
    │  AUTHENTICATED USER                        │
    │  src/app/dashboard/page.tsx                │
    │  - AppShell layout renders                 │
    │  - Header + Sidebar + Content              │
    │  - useAuth() returns user profile          │
    └────────────────────────────────────────────┘
                        │
                        │ User navigates to /employees
                        ↓
        ┌────────────────────────────────┐
        │  src/middleware.ts             │
        │  - Has token ✓                 │
        │  - Role = "HR"                 │
        │  - /employees allowed for HR ✓ │
        │  - Allow request ✓             │
        └────────────────┬───────────────┘
                         │
                         ↓
    ┌─────────────────────────────────────────┐
    │  src/app/employees/page.tsx             │
    │  useEmployees() hook                    │
    │                                         │
    │  ↓ queryFn: searchEmployees()           │
    │  ↓ api.get("/employee/search")          │
    │  ↓ [Request interceptor adds auth]      │
    │  ↓ Backend returns employee list        │
    │  ↓ React Query caches data              │
    │  ↓ Component renders table              │
    └─────────────────────────────────────────┘
                         │
                         │ User navigates to /users (admin only)
                         ↓
        ┌────────────────────────────────┐
        │  src/middleware.ts             │
        │  - Has token ✓                 │
        │  - Role = "HR"                 │
        │  - /users allowed for HR? ✗    │
        │  - Redirect to /unauthorized   │
        └────────────────┬───────────────┘
                         │
                         ↓
    ┌─────────────────────────────────────────┐
    │  src/app/unauthorized/page.tsx          │
    │  "You don't have access to this page"   │
    └─────────────────────────────────────────┘
                         │
                         │ User logs out
                         ↓
    ┌─────────────────────────────────────────┐
    │  useLogout() hook                       │
    │  - auth.service.logout()                │
    │  - POST /auth/logout                    │
    │  - clearAuth()                          │
    │    - Remove access_token cookie         │
    │    - Remove user_role cookie            │
    │    - Clear user context                 │
    │  - Redirect to /login                   │
    └─────────────────────────────────────────┘
                         │
                         ↓
            ┌──────────────────────┐
            │  BACK TO LOGIN PAGE  │
            └──────────────────────┘
```

---

## File Organization & Data Flow

### Service Layer (API Calls)

```
src/services/
├── auth/
│   └── auth.service.ts          → login, logout, refreshToken, verifyEmail
├── user/
│   └── user.service.ts          → getProfile, updateProfile, changePassword, getMySalary, getMyLoans
├── employee/
│   └── employee.service.ts      → getEmployeeCount, searchEmployees, getEmployeeById, createEmployee, etc.
├── loans/
│   └── loans.service.ts         → requestLoan, getMyLoans, getActiveLoansCount, listLoans, approveLoan, rejectLoan
├── bonus/
│   └── bonus.service.ts         → assignBonus, listBonuses, getBonusById, deleteBonus
├── payroll/
│   └── payroll.service.ts       → generatePayroll, listPayrolls, getPayrollById, approvePayroll, etc.
├── salary-structure/
│   └── salary-structure.service.ts  → assignSalaryStructure, approveSalaryStructures, rejectSalaryStructure
└── audit-log/
    └── audit-log.service.ts     → getAuditLogsByRecord, getAuditLogsByUser
```

### Hook Layer (React Query Wrapper)

```
src/hooks/
├── useEmployees.ts     → useEmployeeCount(), useEmployees(params)
├── usePayroll.ts       → usePayrolls(params)
├── useLoans.ts         → useActiveLoansCount(), useMyLoans()
└── useBonuses.ts       → useBonuses(params)

Each hook combines:
- useQuery() from React Query
- Service function call
- Caching with unique queryKey
```

### Component Layer

```
src/app/employees/page.tsx
  ↓ uses hook
src/hooks/useEmployees.ts
  ↓ calls service
src/services/employee/employee.service.ts
  ↓ calls axios
src/lib/axios.ts (with interceptors)
  ↓ hits backend
Backend API /api/v1/employee/search
  ↓ returns response
  ↓ interceptor checks 401 & auto-refreshes if needed
  ↓ hooks with React Query cache
  ↓ component re-renders with data
```

---

## Error Handling Flow

### Network Error (401 Unauthorized)

```
API Response: 401 Unauthorized
        ↓
Response Interceptor (axios.ts) catches
        ↓
isRefreshing = true
        ↓
POST /auth/refresh { withCredentials: true }
  (Sends refresh_token from httpOnly cookie)
        ↓
Backend validates refresh_token
  ├─ If valid → returns new accessToken
  │   ↓
  │   Store in cookie
  │   Re-send original request with new token
  │   Continue ✓
  │
  └─ If invalid → 401 error
      ↓
      processQueue rejects with error
      Cookies.remove(ACCESS_TOKEN_KEY)
      window.location.href = "/login" (redirect)
      ✓ User logged out
```

### Other Errors (4xx, 5xx)

```
API Response: 400, 403, 500, etc.
        ↓
Response Interceptor returns Promise.reject(error)
        ↓
Component/Hook catches error
        ↓
toast.error(getErrorMessage(error))
        ↓ User sees error toast notification
```

---

## Key Technologies & Their Roles

| Technology               | Purpose                                |
| ------------------------ | -------------------------------------- |
| **Next.js 14**           | Framework, routing, SSR/ISR            |
| **React 18**             | UI components & state                  |
| **TypeScript**           | Type safety                            |
| **Tailwind CSS**         | Styling                                |
| **TanStack React Query** | Server state management, caching, sync |
| **Axios**                | HTTP client with interceptors          |
| **js-cookie**            | Cookie management (cross-browser)      |
| **React Hook Form**      | Form state & validation                |
| **Zod**                  | Schema validation                      |
| **lucide-react**         | Icon library                           |
| **react-hot-toast**      | Toast notifications                    |
| **next-themes**          | Dark/Light theme                       |

---

## Summary

```
User Browser
    ↓
Next.js Middleware
    ├─→ Check token validity
    ├─→ Check user role
    └─→ Route protection
        ↓
        ProviderStack (Query, Auth, Theme)
        ↓
        AuthContext
        ├─→ Stores current user
        ├─→ Stores auth state
        └─→ Auto-refresh tokens
            ↓
            Component Tree
            ├─→ AppShell (Header + Sidebar)
            ├─→ Page Component
            │   └─→ Uses hooks (useEmployees, usePayroll, etc.)
            │       └─→ Calls services
            │           └─→ Uses Axios with interceptors
            │               └─→ Backend API
            │
            └─→ Shows data/errors/loading states
```

This architecture ensures:

- ✅ Type-safe API calls
- ✅ Automatic token refresh
- ✅ Role-based route protection (middleware + client)
- ✅ Efficient data caching
- ✅ Seamless error handling
- ✅ User session persistence
