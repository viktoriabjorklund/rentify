```bash
git clone <repo-url>
cd rentify
cd backend
npm install
cd ../frontend
npm install
```

Om du inte har postgresql:

```bash
cd ../backend
brew install postgresql@14
brew services start postgresql@14
```

Skapa sedan en databas (från backend mappen):
```bash
createdb rentify

```
Skapa filen backend/.env med detta innehåll:

```bash
DATABASE_URL="postgresql://<användare>@localhost:5432/rentify"
JWT_SECRET="hemligt-super-lösenord"
```

Sedan kör du första migrationen:
```bash
npx prisma migrate dev --name init
```

För att öppna databasen visuellt kan du köra från backend mappen:
```bash
npx prisma studio
```
Starta backend inuti backend mappen med 
```bash
npm run dev
```
Nu körs backend på port
//localhost:8080

Starta frontend inuti frontend mappen med 
```bash
npm run dev
```
Nu körs frontend på port
//localhost:3000

Ändringar i databasen:

När du har ändrat något i databasen (schema.prisma) behöver du köra en 

```bash
npx prisma migrate dev --name <beskrivande namn på ändringen>
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

