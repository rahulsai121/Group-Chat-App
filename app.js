const express = require('express')
const cors = require('cors')

const sequelize = require('./utility/database');


const userRoutes = require('./routes/user');


const app = express()
require('dotenv').config();

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes)

const PORT = process.env.PORT || 3000;
sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log('Server is running on this PORT--', PORT);
        });
    })