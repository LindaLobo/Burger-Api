const express = require('express')
const app = express()
const port = 4000
const cors = require("cors")

//middlewares funcion que se ejecuta antes de llegar a la ruta

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// cors un mecanismo que permite el intercambio de informacion restrigida entre diferentes dominios
app.use(cors());

//ruta
app.use(require('./routes/index'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = {app}