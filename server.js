import express from 'express';
import methodOverride from 'method-override';
import { PORT, SECRET_JWT_KEY } from './config.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import pageRoutes from './routes/pages.js';
import mangaRoutes from './routes/mangas.js';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token,SECRET_JWT_KEY)
        req.session.user = data
    } catch(error) {
        req.session.user = null
    }
    next()
});

app.use(authRoutes);
app.use(pageRoutes);
app.use(bookRoutes);
app.use(mangaRoutes);

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});

//method override: per defecte els forms fan post així que els hem d'enganyar amb el middleware method-override per fer un put o delete. Això es fa amb un input hidden amb el nom _method i el valor put o delete.
//botón de eliminar en la página de edición del producto
//listado con productos, botones ver, editar y añadir nuevo y link a home