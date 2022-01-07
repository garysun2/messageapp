const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const { loggedIn } = require('./helper')

module.exports=(passport)=>{
    router.post('/',loggedIn,(req,res)=>{
        console.log('logout')
        req.logOut()
        res.end()
    })
    return router
}