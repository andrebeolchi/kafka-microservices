import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '~/config/db';
import { JWT_EXPIRATION, JWT_SECRET } from '~/config';

const router = express.Router();

const generateToken = (user: Record<string, unknown>) => {
  //@ts-expect-error JWT_EXPIRATION type ms.StringValue is not recognized
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

router.post('/register', async (req, res) => {
  const userExists = await db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);

  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await db.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [req.body.username, req.body.email, hashedPassword]
  );

  const { password, ...user } = newUser.rows[0]

  return res.status(201).json({
    message: 'User registered successfully',
    user,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, userResult.rows[0].password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = generateToken({ id: userResult.rows[0].id, email: userResult.rows[0].email });

  return res.status(200).json({
    message: 'Login successful',
    token,
  });
});

router.get("/validate", (req, res) => {
  const token = req.headers["authorization"]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenData = token.split(" ")[1]
    const user = jwt.verify(tokenData, JWT_SECRET)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
})

export { router }