# Monorepo Project Structure

```text
travel-ai-app/
│
├── client/                     # Frontend React Application
│   ├── public/                 
│   ├── src/                    
│   │   ├── components/         # Reusable UI components
│   │   │   ├── FormField.jsx        # Label + Input + Error message wrapper
│   │   │   ├── LoadingButton.jsx    # Submit button with spinner state
│   │   │   ├── Toast.jsx            # Notification popup (success/error/info)
│   │   │   ├── DestinationCard.jsx  # Destination card for grids
│   │   │   ├── TopPlaceCard.jsx     # Place/restaurant/stay sub-card
│   │   │   └── Navbar.jsx           # Global sticky navigation
│   │   ├── pages/              # Views (Home, DestinationDetail, AiSearch, Wishlist, Login, Register)
│   │   ├── hooks/              # Custom reusable hooks
│   │   │   ├── useAuth.js           # Exposes login, register, logout, user, token
│   │   │   └── useApi.js            # Generic data-fetching hook with loading/error
│   │   ├── validators/         # Yup validation schemas
│   │   │   ├── loginSchema.js       # Login form validation (email, password)
│   │   │   ├── registerSchema.js    # Register form validation (name, email, password, confirm)
│   │   │   └── aiSearchSchema.js    # AI search form validation
│   │   ├── context/            # Global UI and Auth state (if not using Redux)
│   │   ├── store/              # Redux store and slices
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       └── authSlice.js
│   │   ├── api/                # Axios instance with interceptors
│   │   │   ├── axiosInstance.js      # Base Axios config with JWT & 401 interceptors
│   │   │   └── authApi.js           # Auth API wrappers
│   │   ├── App.jsx              
│   │   └── index.css           # Tailwind system configuration
│   ├── package.json
│   └── tailwind.config.js      
│
├── server/                     # Backend Express Application
│   ├── src/
│   │   ├── controllers/        # Route handlers (wrapped by asyncHandler — no try/catch)
│   │   │   ├── auth.controller.js
│   │   │   ├── destination.controller.js
│   │   │   ├── wishlist.controller.js
│   │   │   └── ai.controller.js
│   │   ├── routes/             # Map controllers to Express Router logic
│   │   │   ├── auth.routes.js
│   │   │   ├── destination.routes.js
│   │   │   ├── wishlist.routes.js
│   │   │   └── ai.routes.js
│   │   ├── models/             # Mongoose schemas representing the 6 DB Collections
│   │   │   ├── User.model.js
│   │   │   ├── Destination.model.js
│   │   │   ├── Place.model.js
│   │   │   ├── Restaurant.model.js
│   │   │   ├── PropertyStay.model.js
│   │   │   └── Wishlist.model.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── errorHandler.js      # Global centralized error handler (last middleware)
│   │   │   ├── asyncHandler.js      # Wraps async controllers to catch errors
│   │   │   ├── validate.js          # Validates req.body against a Yup schema
│   │   │   └── verifyToken.js       # JWT authentication guard
│   │   ├── validators/         # Yup schemas for request body validation
│   │   │   ├── auth.validator.js    # registerSchema, loginSchema
│   │   │   ├── wishlist.validator.js
│   │   │   └── ai.validator.js
│   │   ├── utils/              # Shared utilities
│   │   │   └── AppError.js          # Custom error class (statusCode, isOperational)
│   │   ├── services/           # External API calls (Gemini recommendation fetcher)
│   │   └── index.js            # Express server entry point handling /api routing
│   ├── tests/                  # Jest + Supertest test files
│   │   └── auth.test.js
│   ├── jest.config.js
│   ├── package.json
│   └── .env                    
│
├── package.json                # Root package for running client & server concurrently
└── README.md
```

## Implementation Notes
*   **Controllers (`server/src/controllers`)**: Every async controller is wrapped by `asyncHandler` — no manual `try/catch` blocks. Controllers throw `AppError` instances for expected errors.
*   **Middleware (`server/src/middleware`)**: `errorHandler` is the last middleware in Express. `validate` middleware checks `req.body` against a Yup schema and returns a 400 with field-level errors on failure. `asyncHandler` catches rejected promises and passes errors to `errorHandler`.
*   **Validators (`server/src/validators`)**: Yup schemas defining the expected shape and constraints of request bodies. Shared between backend validation middleware and can mirror frontend Yup schemas.
*   **Frontend Components (`client/src/components`)**: Reusable `FormField`, `LoadingButton`, and `Toast` components shared across all pages.
*   **Frontend Hooks (`client/src/hooks`)**: `useAuth` abstracts auth dispatching and navigation; `useApi` provides a generic data-fetching pattern with loading/error state.
*   **Frontend Validators (`client/src/validators`)**: Yup schemas used by Formik forms for client-side validation. Should mirror backend schemas where applicable.
*   **API Layer (`client/src/api`)**: `axiosInstance.js` creates a configured Axios instance with request interceptors (auto-attach JWT) and response interceptors (handle 401 globally).
*   **Routing Modules (`server/src/routes`)**: Segregated logically by `auth.routes.js`, `destination.routes.js`, `wishlist.routes.js`, and `ai.routes.js`.
*   **Database Models (`server/src/models`)**: Segregated logically into `User.model`, `Destination.model`, `Place.model`, `Restaurant.model`, `PropertyStay.model`, `Wishlist.model`.
