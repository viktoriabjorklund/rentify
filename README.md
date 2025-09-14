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
brew install postgresql@14
brew services start postgresql@14
createdb rentify
```

Skapa sedane en databas:
```bash
createdb rentify
```
Skapa filen backend/.env med detta innehåll:

```bash
DATABASE_URL="postgresql://<användare>@localhost:5432/rentify"
JWT_SECRET="hemligt-super-lösenord"
```

För att öppna databasen visuellt kan du använda:
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




