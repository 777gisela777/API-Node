import express from 'express';
import methodOverride from 'method-override';
import { UserRepository } from './user-repository.js';
import { PORT, SECRET_JWT_KEY } from './config.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static("public")); // Carrega CSS i altres fitxers públics
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs'); // Motor de plantilles
app.set('views', './views'); // Ubicació de les plantilles

//inicio middleware
app.use((req,res,next)=>{
    const token =req.cookies.access_token
    req.session={user: null}
    try{
        const data=jwt.verify(token,SECRET_JWT_KEY)
        req.session.user=data
    }catch(error){
        req.session.user=null
    }
    next() // seguir a la siguiente ruta o middleware.
});

app.get('/', (req,res)=>{
    //const {user} = req.session;
    //res.render('register', {user});
    const username = "";
    res.render('register', username);
});

app.post('/register', async (req,res)=>{
    //aqui el body es el cuerpo de la petición
    const {username,password}=req.body
    console.log(req.body)
    try{
        const id= await UserRepository.create({username,password});
        res.send({id})
    }catch(error){
        //No es buena idea mandar el error del repositorio
        res.status(400).send(error.message)
    }
});

app.post('/login', async (req,res)=>{
    try{
        const {username,password}=req.body
        console.log("llego aqui")
        const user = await UserRepository.login({username,password})
        console.log("llego aqui 1")
        const token = jwt.sign(
            {id: user._id, username: user.username},
            SECRET_JWT_KEY, 
            {
            expiresIn:'1h'
            })
            console.log("llego aqui 2")
        res
        .cookie('access_token',token,{
            httpOnly:true, //la cookie solo se puede acceder en el servidor, no podrem fer un document.cookie
            //secure:true, //la cookie solo funciona en https
            secure: process.env.NODE_ENV==='production',
            sameSite:'strict', //la cookie es pot accedir dins del domini
            maxAge:1000*60*60 //la cookie te un temps de validesa d'una hora
        })
        .send({ user,token })
    }catch (error){
        //401 = no autorització
        res.status(401).send(error.message)
    }
});

app.post('/logout',(req,res)=>{
    res
    .clearCookie('access_token')
    .json({message:'logout successful'})
    .send('logout');
});

app.get('/protected', (req,res)=>{
    const {user} = req.session;
    if(!user) return res.status(403).send('No autorizado')
    if (!req.cookies.access_token) return res.status(403).send('No autorizado')
    res.render('register', user);
});

app.use('/products', (req,res)=>{
    const {user} = req.session;
    if(!user) return res.status(403).send('No autorizado')
    next()
});

app.use('/books', (req,res)=>{
    const {user} = req.session;
    if(!user) return res.status(403).send('No autorizado')
    res.render('bookings', user);
    let name = req.user.username;
});

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});

//method override: per defecte els forms fan post així que els hem d'enganyar amb el middleware method-override per fer un put o delete. Això es fa amb un input hidden amb el nom _method i el valor put o delete.
//botón de eliminar en la página de edición del producto
//listado con productos, botones ver, editar y añadir nuevo y link a home