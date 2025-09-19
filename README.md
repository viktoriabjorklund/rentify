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




