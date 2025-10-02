# Services (Model layer in MVVM)

Service layer that handles all API communication with the backend. Provides clean interfaces for data operations.

## Files:

### authService.ts
- **Purpose**: Handles all authentication-related API calls
- **Functions**:
  - `registerUser()` - User registration
  - `loginUser()` - User authentication
  - `getStoredToken()` - Retrieve JWT from localStorage
  - `getStoredUser()` - Retrieve user data from localStorage
  - `storeToken()` - Save JWT to localStorage
  - `storeUser()` - Save user data to localStorage
  - `removeToken()` - Clear authentication data
- **Used by**: useAuth hook

### toolService.ts
- **Purpose**: Handles all tool-related API operations
- **Functions**:
  - `getAllTools()` - Fetch all available tools
  - `getUserTools()` - Fetch current user's tools
  - `createTool()` - Create new tool listing
  - `updateTool()` - Update existing tool
  - `deleteTool()` - Delete tool listing
- **Types**: Defines Tool interface and related types
- **Used by**: useSearch, useYourTools hooks, Dashboard page, ToolList component

## Architecture Notes:
- All services use consistent error handling
- JWT authentication is automatically handled
- Services abstract away HTTP implementation details
- Consistent API response handling across the app