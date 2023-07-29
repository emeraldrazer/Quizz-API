const User = require('./SaveToDB');

const editProfile = async function (req, res) {
    const userID = req.params.userID;
    const data = JSON.parse(JSON.stringify(req.body));

    if (!userID) {
        return res.status(404).json({ err: true, msg: 'No UserID Specified' });
    }

    const updateData = {
        $set: {
            avatar_id: data.avatar_id
        }
    }

    const update = await User.updateOne({ _id: userID }, updateData);

    if (!update) {
        return res.status(500).json({ err: true, msg: 'Something went wrong' });
    }

    return res.status(200).json({ err: false, msg: 'Avatar Updated Successfully!' });
}

module.exports = { editProfile };