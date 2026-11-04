import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

git init
git add .
    git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/EJV22/noteron.git
    git push -u origin main