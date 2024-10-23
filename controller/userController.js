const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../model/user');
const Message = require('../model/message')
const { where } = require('sequelize');
const message = require('../model/message');

require('dotenv').config();

exports.userPost = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) {
            const hash = await bcrypt.hash(req.body.password, 10);
            const newuser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            res.status(201).json({ message: 'User created successfully' })
        }
        else {

            res.status(409).json({ message: 'User already exists' })
        }


    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }

}


exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }


        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(404).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.messagePost = async (req, res) => {
    try {

        const newMessage = await Message.create({
            message: req.body.chatMessage,
            userId: req.userId
        });


        newMessage.dataValues.user = { name: 'you' };

        res.status(200).json({
            message: 'Message created successfully',
            newMessage,
        });

    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }

}


exports.messageGet = async (req, res) => {
    const messages = await Message.findAll({
        include: [{
            model: User,
            attributes: ['id', 'name',]

        }]
    })
    const userId = req.userId
    const modifiedmessages = messages.map(message => {
        if (message.userId == userId) {
            message.user.name = 'you';
        }

        return message;

    });
    /*console.log('message----------',messages[2].user)
    console.log('modified-------------',modifiedmessages[2].user)
*/
    res.status(200).json({ modifiedmessages })
}