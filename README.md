<img width="2940" height="1591" alt="image" src="https://github.com/user-attachments/assets/d950c8f3-bd33-45c8-98cb-b2798db0d29f" />

## How to run project on your machine:

<b>Option 1 (recommended):</b>

Use the deployed version https://rentify-psi-roan.vercel.app/

<b>Option 2:</b>

Run with <b>Docker.</b>

Make sure you have Docker installed, then do:
```bash
docker pull viktoriabjorklund/rentify-backend:latest
docker run -p 8080:8080 viktoriabjorklund/rentify-backend:latest
```
This will open up backend on http://localhost:8080/

You need to run frontend via npm:
```bash
git clone git@github.com:viktoriabjorklund/rentify.git
cd rentify
cd frontend
npm install
npm run dev
```
This will open up frontend on http://localhost:3000/


<b>To run tests:</b>
```bash
cd backend
npm install
npm run test
```

## 🏗️ Backend Architecture

```
backend/
├── prisma/                 
│   ├── schema.prisma       
│   └── schema.test.prisma  
│   └── migrations          
│   └── test.db             
├── src/            
│   ├── controllers
│   │   └── bookingController.js
│   │   └── requestController.js
│   │   └── toolController.js 
│   │   └── userController.js 
│   └── generated/prisma 
│   └── middleware
│   │   └── authMiddleware.js
│   │   └── uploadMiddleware.js
│   └── models
│   │   └── bookingModel.js
│   │   └── requestModel.js
│   │   └── toolModel.js
│   │   └── userModel.js
│   └── routes
│   │   └── bookingRoutes.js
│   │   └── requestRoutes.js
│   │   └── toolRoutes.js
│   │   └── userRoutes.js
│   └── prismaClient.js
│   ├── server.js
├── tests/
│   ├── assets
│   │   └── spike_test.jpg
│   ├── api.test.js
│   ├── jest.config.js
├── cloudinary.js
├── docker-compose.yaml
├── Dockerfile
├── package-lock.json
├── package.json
```

## 🏗️ Frontend Architecture (MVVM)

This project follows the MVVM (Model-View-ViewModel) pattern for the frontend (kommer behöva uppdateras):

```
frontend/
├── services/          # Model layer
│   ├── authService.ts    # Authentication API calls
│   └── toolService.ts    # Tool-related API calls
├── hooks/            # ViewModel layer
│   ├── useAuth.ts        # Authentication state & logic
│   └── useSearch.ts      # Search page state & logic
├── pages/            # View layer (Pages)
│   ├── api/              # API routes
│   │   └── hello.ts      # Example API endpoint
│   ├── _app.tsx          # App wrapper
│   ├── _document.tsx     # HTML document structure
│   ├── index.tsx         # Homepage
│   ├── searchpage.tsx    # Tool browsing page
│   ├── login.tsx         # Login page
│   ├── createaccount.tsx # Registration page
│   └── dashboard.tsx     # User dashboard
└── components/       # View layer (Reusable UI)
    ├── AuthCard.tsx      # Authentication form wrapper
    ├── Footer.tsx        # Site footer
    ├── FormField.tsx     # Reusable form input
    ├── Navbar.tsx        # Navigation bar
    ├── PrimaryButton.tsx # Styled button component
    ├── SearchBar.tsx     # Search input component
    └── ToolList.tsx      # Tool display component
```

