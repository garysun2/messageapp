const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')

const {loggedIn,notLoggedIn}=require('./helper')
// router.post('/',async (req,res)=>{
//     const user=users.find(user=> user.username ===req.body.username)
//     if(user==null){
//         return res.status(400).send('User not found')
//     }
//     try{
//         if(await bcrypt.compare(req.body.password, user.password)){
//             req.session.username=req.body.username
//             if(req.session.authenticated){
//                 res.send('already authenticated')
//             }else{
//                 req.session.authenticated=true
//                 req.session.username=req.body.username
//                 req.session.password=req.body.password
//                 res.json(req.session)
//             }
//         }else{
//             res.send('Wrong password')
//         }
//     }catch{
//         res.status(500).send()
//     }
// })

module.exports=(passport, redisStore)=>{
    
    router.get('/',loggedIn,(req,res)=>{
        redisStore.all((error, sessions)=>{
            console.log(sessions)
        })
        res.send('Already logged in.')
    })
    router.post('/',notLoggedIn,passport.authenticate('local',{
        failureFlash: 'Invalid username or password.' 
    }),
    (req,res)=>{
        console.log('user authenticated and logged in')
        res.send('Logged in successfully')
    })


    return router
}