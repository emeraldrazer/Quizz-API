const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        maxlength: [20, 'Username cannot be over 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },
    email_verified: {
        type: Boolean,
        required: [true, 'Email Verification']
    },
    password: {
        type: String,
        required: [true, 'Invalid Password'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Please specify your gender']
    },
    date_of_birth: {
        type: String,
        required: [true, 'Please specify your date of birth']
    },
    avatar_id: {
        type: String,
        required: [true, 'Please specify avatar ID'],
        default: "/static/media/022.341d7154eb9d42cff59c.jpg"
    },
    statistics: {
        percentage: {
            type: Number,
            default: 0
        },
        overall: {
            type: Number,
            default: 0
        },
        correct_answers: {
            type: Number,
            default: 0
        },
        incorrect_answers: {
            type: Number,
            default: 0
        },

        categories: [{
            category: {
                type: String,
            },
            correct_answers: {
                type: Number,
                default: 0
            },
            incorrect_answers: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            percentage: {
                type: Number,
                default: 0
            }
        }]
    },
    badges:[{
            type: Number
        }
    ],
    overall: {
        type: Number
    },
    game_level: {
        type: Number,
        required: [true, 'Please specify game level']
    },
    game_xp: {
        type: Number,
        required: [true, 'Please specify game xp']
    }
})

module.exports = mongoose.model('User', TaskSchema)