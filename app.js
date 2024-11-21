const express = require('express')
const cors = require('cors')



const sequelize = require('./utility/database');

const User = require('./model/user')
const Message = require('./model/message')
const Group = require('./model/group')
const Groupmember = require('./model/groupMember')



const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group')
const messageRoutes = require('./routes/message')



const app = express()
require('dotenv').config();



app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes)
app.use('/group', groupRoutes)
app.use('/message', messageRoutes)


User.hasMany(Message)
Message.belongsTo(User)

Group.hasMany(Message)
Message.belongsTo(Group)

User.hasMany(Groupmember)
Groupmember.belongsTo(User)

Group.hasMany(Groupmember)
Groupmember.belongsTo(Group)


const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log('Database synced');

        const server = app.listen(PORT, () => {
            console.log('Server is running on this PORT--', PORT);
        });

        const io = require('socket.io')(server, {
            cors: {
                origin: 'http://127.0.0.1:5500'
            }
        })

        io.on('connection', (socket) => {
            console.log('a user connected')

            socket.on('join group', (id) => {
                console.log('join this group ' + id)
                socket.join(id);
            })

            socket.on('leave group', (id) => {
                console.log('leaving this group ' + id)
                socket.leave(id)
            })

            socket.on('group message', (obj) => {

                console.log(obj.currentGroup,)
                io.to(obj.currentGroup).emit('group message', obj.data)
                //socket.broadcast.emit('group message',obj)
            })
        })


    })