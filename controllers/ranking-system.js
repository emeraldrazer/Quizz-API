const User = require('./SaveToDB');
const { generateToken } = require('../middleware/token-system');

const leaderBoard = async function (req, res) {
    const allPlayers = await User.find({})
        .select('-_id -email -email_verified -password -gender -date_of_birth -statistics.categories')
        .sort({ game_level: -1, game_points: -1 })
        .exec();

    if (!allPlayers) {
        return res.status(400).json({ err: true, data: null });
    }

    return res.status(200).json({ err: false, data: allPlayers });
}

const userInfo = async function (req, res) {
    const user = req.params.user;

    const aboutUser = await User.findOne({ username: user })
        .select('-_id -email -email_verified -password -gender -date_of_birth')
        .exec();

    if (!aboutUser) {
        return res.status(400).json({ err: true, data: null });
    }

    return res.status(200).json({ err: false, data: aboutUser });
}

const request = async function (req, res) {
    const data = JSON.parse(JSON.stringify(req.body));

    if (!data) {
        return res.status(403).json({ err: true, msg: 'Forbidden' })
    }

    const token = generateToken(data.id, '15s');

    res.status(200).json({ err: false, token: token })
}

const configuration = async function (req, res) {
    const data = JSON.parse(JSON.stringify(req.body));

    let decodedUser = req.user.signed;

    const current = await User.findOne({ _id: decodedUser })
        .select('game_level game_xp statistics')
        .exec();

    if (!current) {
        return res.status(403).json({ err: true, msg: 'Forbidden' })
    }

    let numberOfCorrect = 0;
    let numberofIncorrect = 0;

    for (let index = 0; index < current.statistics.categories.length; index++) {
        const element = current.statistics.categories[index];

        numberOfCorrect += element.correct_answers;
        numberofIncorrect += element.incorrect_answers;
    }

    let overall = numberOfCorrect + numberofIncorrect;
    let totalInCategory = data.correct_answers + data.incorrect_answers;

    let percentage = 0;


    if (current.statistics.percentage == 0) {
        percentage = ((data.correct_answers / totalInCategory) * 100).toFixed(2);
    }
    else {
        percentage = ((numberOfCorrect / overall) * 100).toFixed(2);
    }

    const filter = {
        _id: decodedUser,
    };

    const setValue = {
        $set: {
            game_level: await updateLVL(current.game_xp + data.game_xp),
            'statistics.percentage': percentage,
            'statistics.categories.$[categoryElem].percentage': ((data.correct_answers / totalInCategory) * 100).toFixed(2)
        },
        $inc: {
            game_xp: data.game_xp,
            'statistics.correct_answers': data.correct_answers,
            'statistics.incorrect_answers': data.incorrect_answers,
            'statistics.overall': data.correct_answers + data.incorrect_answers,
            'statistics.categories.$[categoryElem].correct_answers': data.correct_answers,
            'statistics.categories.$[categoryElem].incorrect_answers': data.incorrect_answers,
            'statistics.categories.$[categoryElem].total': data.correct_answers + data.incorrect_answers,
        },
    }

    const options = {
        arrayFilters: [{ "categoryElem.category": data.category }],
    };

    const update = await User.updateOne(filter, setValue, options)

    if (!update) {
        return res.status(403).json({ err: true, update: update })
    }

    return res.status(200).json({ err: false, result: update })

}

const updateLVL = async function (game_xp) {
    const xpThresholds = {
        450: 1,
        1100: 2,
        2025: 3,
        3250: 4,
        4900: 5,
        6850: 6,
        9100: 7,
    };

    for (const xpThreshold in xpThresholds) {
        if (game_xp < xpThreshold) {
            return xpThresholds[xpThreshold];
        }
    }

    return 8; // If game_xp is greater than 9100
}

module.exports = { leaderBoard, userInfo, request, configuration };