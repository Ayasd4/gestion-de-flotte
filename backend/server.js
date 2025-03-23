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
const chauffeurRouter = require('./routes/chauffeur');
const demandesRouter = require('./routes/demandes');
const numparcRouter = require('./routes/getAllNumparc');
const nameRouter = require('./routes/getAllName');
const statutRouter = require('./routes/updateStatus');
const atelierRouter = require('./routes/atelier');
const maintenanceRouter = require('./routes/maintenance');
const diagnosticRouter = require('./routes/diagnostic');
const getdemandeRouter = require('./routes/getDemandeById');
const technicienRouter = require('./routes/technicien');

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
app.use('/chauffeur',chauffeurRouter);
app.use('/demandes', demandesRouter);
app.use('/getAllNumparc', numparcRouter);
app.use('/getAllName', nameRouter);
app.use('/updateStatus', statutRouter);
app.use('/atelier', atelierRouter);
app.use('/getDemandes', maintenanceRouter);
app.use('/diagnostic', diagnosticRouter);
app.use('/getDemandeById', getdemandeRouter);
app.use('/technicien', technicienRouter);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is now listening at port: ${port}`);
});
