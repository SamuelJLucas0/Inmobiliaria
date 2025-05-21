const {PORT} = require('./config.js');


const express = require('express');
const morgan = require('morgan');
const path = require('path');  // Importa path

const app = express();
const usuarios = require('./routes/usuarios');
const auth = require('./middleware/auth');
const cors = require('./middleware/cors');
app.use('/uploads', express.static('uploads')); // Servir imágenes
app.use(cors);
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use("/usuarios", usuarios);
app.use(auth);


app.listen(PORT, () => {
    console.log('Server is running on PORT');
});
