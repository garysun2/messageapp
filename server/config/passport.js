const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {UserModel}=require('../models/user.js')
function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        //using users array should change once database is attached
        //const user = users.find((user) => user.username === username);
        const user=await UserModel.findOne({username})
        if (user == null) {
            return done(null, false, { message: "No user ${username} exist" });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user)=>{
            done(err, user)
        })
    });
}

module.exports = initialize;
