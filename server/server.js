const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const logger = require('morgan')


const PORT = 3000
const localhost = 'http://localhost:' + PORT

const dbConfig = require('./config/secret')

const app = express();

app.use(cors());

const server = require('http').createServer(app)
const io = require('socket.io').listen(server)


app.use((req, res, next) => {
    res.header('Access-Control-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-with, Contrent-Type, Accept, Authorization');
    next();
})

app.use(express.json({
    limit: '50mb'
}))
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))
app.use(cookieParser())
// app.use(logger('dev'))

/**
 * @params dbConfig.url
 * @description DataBase connection
 */
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
})

require('./socket/stream')(io);

/**
 * @params auth, posts
 * @description Sets API
 */
const auth = require('./routes/authRoutes')
const posts = require('./routes/postRoutes')
const users = require('./routes/userRoutes')
const friends = require('./routes/friendsRoutes')

/**
 * middle ware
 */
app.use('/api/chatapp', auth)
app.use('/api/chatapp', posts)
app.use('/api/chatapp', users)
app.use('/api/chatapp', friends)

/**
 * @params { link } localhost:PORT
 * @description logs server link
 */
server.listen(PORT, () => console.log(`Server is running on ${localhost}`))