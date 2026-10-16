import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config.js';
import { UserRepository } from '../user-repository.js';

const router = Router();

const setAccessTokenCookie = (res, payload) => {
    const token = jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: '1h' });

    return res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
    });
};

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const id = await UserRepository.create({ username, password });
        setAccessTokenCookie(res, { id, username }).status(201).json({ id });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserRepository.login({ username, password });

        setAccessTokenCookie(res, { id: user._id, username: user.username })
            .json({ user });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('access_token').json({ message: 'logout successful' });
});

export default router;