const express = require('express')
const cors = require('cors')
const cron = require('node-cron');
const path=require('path')


const sequelize = require('./utility/database');

const User = require('./model/user')
const Message = require('./model/message')
const Group = require('./model/group')
const Groupmember = require('./model/groupMember')
const OldMessages=require('./model/archivedMessage')



const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group')
const messageRoutes = require('./routes/message')


const archiveOldMessages = require('./functions/archiveMessages');

const app = express()
require('dotenv').config();



app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req,res,next)=>{
    if(!req.path.startsWith('/user') && 
    !req.path.startsWith('/group') &&
    !req.path.startsWith('/message'))
    {
    res.sendFile(path.join(__dirname,`public/${req.url}`))
    }
    else{
        next();
    }
})

app.use('/user', userRoutes)
app.use('/group', groupRoutes)
app.use('/message', messageRoutes)

User.hasMany(Message)
Message.belongsTo(User)


User.hasMany(OldMessages)
OldMessages.belongsTo(User)


Group.hasMany(OldMessages)
OldMessages.belongsTo(Group)

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
                socket.join(id);
            })

            socket.on('leave group', (id) => {
                socket.leave(id)
            })

            socket.on('group message', (obj) => {

                io.to(obj.currentGroup).emit('group message', obj.data)
            })
        })
        cron.schedule(' 0 0 * * *', () => {
            console.log('Running cron job to archive old messages...');
            archiveOldMessages();
        });


    })