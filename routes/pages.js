import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('register', {});
});

router.get('/protected', (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send('No autoritzat');

    res.render('register', user);
});

export default router;