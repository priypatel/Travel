# Monorepo Project Structure

```text
travel-ai-app/
│
├── client/                     # Frontend React Application
│   ├── public/                 
│   ├── src/                    
│   │   ├── components/         # Reusable widgets (DestinationCard, TopPlaceCard, Navbar)
│   │   ├── pages/              # Views (Home, DestinationDetail, AiSearch, Wishlist)
│   │   ├── context/            # Global UI and Auth state
│   │   ├── api/                # Axios wrappers mapping to /api endpoints
│   │   ├── App.js              
│   │   └── index.css           # Tailwind system configuration
│   ├── package.json
│   └── tailwind.config.js      
│
├── server/                     # Backend Express Application
│   ├── src/
│   │   ├── controllers/        # auth, destination, entity (places/rests), wishlist, ai
│   │   ├── routes/             # map controllers to Express Router logic
│   │   ├── models/             # Mongoose schemas representing the 6 DB Collections
│   │   ├── services/           # External API calls (Gemini recommendation fetcher)
│   │   ├── middleware/         # Security (verifyToken intercepts protected routes)
│   │   └── index.js            # Express server entry point handling /api routing
│   ├── package.json
│   └── .env                    
│
├── package.json                # Root package for running client & server concurrently
└── README.md
```

## Implementation Notes
*   **Routing Modules (`server/src/routes`)**: Segregated logically by `auth.routes.js`, `destination.routes.js`, `wishlist.routes.js`, and `ai.routes.js`.
*   **Database Models (`server/src/models`)**: Segregated logically into `User.model`, `Destination.model`, `Place.model`, `Restaurant.model`, `PropertyStay.model`, `Wishlist.model`.
