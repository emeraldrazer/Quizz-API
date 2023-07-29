const nodemailer = require('nodemailer');
const {generateToken} = require('../middleware/token-system');
const User = require('./SaveToDB');
const path = require('path');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Sendinblue',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

const sendPasswordResetEmail = async (email, token) => {
    const mailOptions = {
        from: 'Quizz support@quizz.com',
        to: email,
        subject: 'Password Reset Request',
        text: `<h2>Hello! We've received a request to reset your password.</h2>
Please click the following link and follow the instructions <a href='http://localhost:3001/api/v1/password-reset/${token}'>Reset Password</a>
<b>If you did not request a password reset, You can safely disregard this email.</b>`,
};

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const passwordResetRequest = async function (req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
    
    try {
        const findUser = await User.findOne({email: data.email});    
        
        if(!findUser){
            return res.status(404).json({err: true, msg: 'Invalid Credentials'})
        }

        const token = generateToken(data.email, '5m');
        sendPasswordResetEmail(data.email, token);  

        res.status(200).json({err: false, msg: 'Please check your email for further instructions'})
        
    } catch (error) {
        res.status(500).json({err: true, msg: error})
    }
}

const form = async function(req, res) {
    res.status(200).sendFile(path.resolve(__dirname, '../public', 'index.html'))
}

const resetPassword = async function(req, res) {
    try {
        const { newPassword } = req.body;

        let decodedEmail = req.user.signed;

        const updatePassword = {
            $set: {password: newPassword}
        }
    
        const user = await User.updateOne({email: decodedEmail}, updatePassword, {new: true, runValidators: true})
    
        if(!user){
            return res.status(404).json({err: true, msg: 'No user found'})
        }
        
        return res.status(200).json({err: false, msg: 'Password Successfully Changed.'})
    } catch (error) {
        return res.status(500).json({err: true, msg: error})
    }
}



module.exports = {resetPassword, passwordResetRequest, form}