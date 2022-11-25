import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import { DBConnect, Users } from "./controller.js";


const app = express();
app.use(express.json())

// DBConnect(cb);

//---------Metodos y estrategias -----------
// singup
passport.use('singup', new Strategy({ passReqToCallback: true },
    (req, username, password, done) => {
        const { email } = req.body
        Users.findOne({ username }, (err, user) => {
            if (user) return done(null, false);
            Users.create({ username, password, email }, (err, user) => {
                if (err) returndone(err)
                return done(null, user)
            })
        })

    }));



passport.use('login', new Strategy({}, (username, password, done) => {
    Users.findOne({ username, password }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        return done(null, user);
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    Users.findById(id, done)
});


app.use(session({
    secret: "123456789",
    cookie: {
        maxAge: 60000
    },
    saveUninitialized: false,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//-------------------------------------------------

//*delcaracion de rutas 

const authMDW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({ error: true })
};


app.post(
    '/login', passport.authenticate('login', { failureRedirect: '/error' }),
    (req, res) => {
        res.send({ error: false })
    });

app.post(
    'singup', passport.authenticate('singup', { failureRedirect: '/error' }),
    (req, res) => {
        res.send({ error: false })
    });


app.get('/datos', authMDW, (req, res) => {
    res.send({ hola: mundo })
})

DBConnect(() => {
    app.listen(8080, () => console.log("conectado!!"))
})


