import express from "express";
import session from "express-session";

const app = express();

//*session
app.use(session({
    secret: "123456789",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

//* middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authMW = (req, res, next) => {
    req.session.username ? next() : res.send({ error: true, msg: "sin sesion" })
};

//* memoria /db 

const usuarios = [];

//*Endpoints:

//* a)Registro   (get,post)

app.get("/registro", (req, res) => {

});

app.post("/registro", (req, res) => {
    const { nombre, password, email } = req.body;
    const user = usuarios.find(u => u.nombre == nombre)

    if (user) return res.send({ error: true, msg: 'usuario existe' });

    usuarios.push({ nombre, password, email })
    res.send({ error: false, msg: "Creado" })
    // res.redirect('/login')
});

//* b)Loggin     (get,post)

app.get('/login', (req, res) => {


});

app.post('/login', (req, res) => {
    const { nombre, password } = req.body;
    const user = usuarios.find(user => user.nombre == nombre && user.password == password)
    if (!user) return res.send({ error: true, msg: 'usuario no existe' })
    req.session.username = nombre;
    res.send({ error: false, usuario: req.session.username })
    // res.redirect('/datos');

});


//* c)Logout (get)

app.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        res.send({ error: false, msg: 'adios' })
    })

});

//* d)Datos (get)


app.get('/datos', authMW, (req, res) => {

    const user = usuarios.find(u => u.nombre == req.session.username);
    res.send({ error: false, data: user })
});






app.listen(8081, () => {
    console.log("Conectado!!")
});

