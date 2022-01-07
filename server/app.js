//libraries
const express=require('express')
const app=express()
const session=require('express-session')
const redis = require('redis');
const connectRedis=require('connect-redis')
const RedisStore = connectRedis(session)
const passport=require('passport')
const flash = require('express-flash')
const passportConfig = require('./config/passport')
const {loggedIn,notLoggedIn}=require('./routes/helper')
require('dotenv').config() //.env folder for mongodb login credential
const mongoose=require('mongoose')
const cors=require('cors')
const http=require('http')
const bodyparser=require('body-parser')
//placeholder for database store of users
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology:true})
.catch((error)=>console.log(error))

const db=mongoose.connection

db.once('open',() => {
    console.log('MongoDb connected')
  })
  
db.on('error', err => {
console.error('connection error:', err)
})

db.on('disconnected',()=>{
    console.log('Database disconnected, retrying connection...');
    mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology:true})
    .catch((error)=>console.log(error))
})
//Configure redis client, used for session store
const redisClient = redis.createClient(process.env.REDIS_URL)
//initialize to access sessison data later for authorization purpose
const redisStore = new RedisStore({client: redisClient})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(flash())
//express session setup

app.use(session({
    store: redisStore,
    resave:false,
    saveUninitialized:false,
    secret:'secret',
    cookie: {
        httpOnly: true,
        maxAge: 60*60*1000 //1hour
    }
}))

//cors setup
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
//passport setup
app.use(passport.initialize())
app.use(passport.session())

passportConfig(passport)

//parse body
app.use(bodyparser.urlencoded({ extended: true }));

//routes
const registerrouter=require('./routes/register')(passport)
const loginrouter=require('./routes/login')(passport, redisStore)
const logoutrouter=require('./routes/logout')(passport)
const messageRouter=require('./routes/message')
app.use('/login',loginrouter)
app.use('/register',registerrouter)
app.use('/logout',logoutrouter)
app.use('/message',messageRouter)// when client request messages


app.listen(8000)