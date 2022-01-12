const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const {loggedIn,notLoggedIn}=require('./helper')
const {UserModel}=require('../models/user.js')
const {check,validationResult}=require('express-validator')

module.exports=(passport)=>{
    let checkUser=async (req,res,next)=>{
        const user=await UserModel.findOne({'username': req.body.username})
        if(user){
            res.send(`user ${req.body.username} already registered`) 
        }else{
            next()
        }
    }

    router.get('/',notLoggedIn,(req,res)=>{
        console.log("hit this point")
        res.render('register.ejs',{errorMessage:''})
    })
    
    router.post('/',
    [check('username').isLength({ min: 3 ,max: 20}).isAlphanumeric()]
    ,notLoggedIn,checkUser,async (req,res)=>{
        try{
            //validator check
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                console.log(errors)
               return res.status(400).send('failed data validation')
            }
            const hashedpass= await bcrypt.hash(req.body.password,10)
            const user=new UserModel({'username':req.body.username,'password':hashedpass})

            await user.save()
            res.json({text: 'hello there'})
        }catch(err){
            if (err.name === "ValidationError") {
                res.send('a mongoose validation error')
            }
            res.redirect('/register')
        }
    })
    return router
}