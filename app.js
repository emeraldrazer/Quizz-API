const express = require('express');
const app = express();
const notFound = require('./middleware/notfound')
const paths = require('./routes/paths');
const port = process.env.PORT || 3001;
require('dotenv').config()

app.use(express.json());
app.use('/api/v1/', paths);

app.use(notFound);

const connectDB = require('./db/connect')

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`Quizz API is Online on port ${port}`))
    } catch (error) {
        console.log(`${error}\nQuizz API Has Crashed...`);
    }
}

start();
