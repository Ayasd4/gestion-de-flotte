const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();


const bodyParser = require("body-parser");
const port = process.env.PORT || 3100;

const vehiculeRouter = require('./routes/vehicule');
const utilisateurRouter =  require('./routes/utilisateur');
const authentificationRouter = require("./routes/authentification");
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth'); 


// Créer le serveur Node.js
app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser());

app.use(cors(
    {
        credentials: true,
        origin: ["http://localhost:3100","http://localhost:8080", "http://localhost:4200"]
    }
));

app.use('/vehicules', vehiculeRouter);
app.use('/utilisateur', utilisateurRouter);
app.use('/authentification', authentificationRouter);
app.use('/admins', adminRouter);
app.use('/login', authRouter);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is now listening at port: ${port}`);
});
