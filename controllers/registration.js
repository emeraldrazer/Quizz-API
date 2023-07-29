const { sendVerificationEmail } = require('./VerifyMail');
const { generateToken} = require('../middleware/token-system');
const User = require('./SaveToDB');

const register = async function (req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
    
    const findUser = await User.findOne({email: data.email});

    if(findUser){
        return res.status(403).json({err: true, msg: 'Email address is already associated with another account'})
    }
    
    const save = {
        username: data.username,
        email: data.email,
        email_verified: false,
        statistics: {
          categories: [
            {category: 'general'},
            {category: 'sports'},
            {category: 'animals'},
            {category: 'mythology'},
            {category: 'geography'},
            {category: 'history'},
            {category: 'politics'},
            {category: 'science_and_nature'},
            {category: 'film'},
            {category: 'music'},
            {category: 'books'},
          ]  
        },
        password: data.password,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        avatar_id: "/static/media/022.341d7154eb9d42cff59c.jpg",
        game_level: 1,
        game_points: 0
    };

    try{
        await User.create(save);
        
        const token = generateToken(data.email, '30m');
        sendVerificationEmail(data.email, token);

        res.status(201).json({err: false, msg: 'Successfully Registered! Please check your email for verification'})
    }
    catch(error){
        res.status(500).json({err: true, msg: error})
    }
}

const login = async function (req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
    
    try {
        const login = await User.findOne({username: data.username, password: data.password})

        if(!login){
            return res.status(404).json({err: true, msg: 'Invalid Credentials'});
        }

        res.status(200).json({err: false, msg: 'Successfully logged in.', result: login})
    } catch (error) {
        res.status(500).json({err: true, msg: error})
    }
}

module.exports = { register, login};
