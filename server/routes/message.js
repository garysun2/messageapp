const express=require('express')
const router=express.Router()
const {ChatRoomModel, MessageModel}=require('../models/chat')
const {loggedIn,notLoggedIn}=require('./helper')
const {UserModel}=require('../models/user.js')
const mongoose=require('mongoose')

router.get('/chatrooms',loggedIn,async (req, res)=>{
    try{
        const chatrooms=await ChatRoomModel.find(
            {participants : req.user.username} 
        )
        res.json(chatrooms.map((object)=>{
            return object._id
        }))
    }catch(err){
        res.status(500).json(err);
    }
})

// route for initialy rendering list of users 
router.get('/getUser',loggedIn,async (req,res)=>{
    //TODO get client username
    //return list of messages that the client is in
    //
    if(req.query.name){
        const fuzzyname= new RegExp(req.query.name, 'gi')
        try{
            const Users=await UserModel.find({username: fuzzyname});
            queryResult=Users.map((user)=>{
                return user.username
            })
            res.json(queryResult)
        }catch(err){
            res.status(500).json(err);
        }
    }    
})

var connectionPool={}

router.get('/longpoll', async (req, res)=>{
    //add connection
    if(req.query.chatroomid){
        console.log('poll added')
        if(!Array.isArray(connectionPool[req.query.chatroomid])){
            connectionPool[req.query.chatroomid]=[];
        }
        connectionPool[req.query.chatroomid].push(res);
    }else{
        res.status(500).json({type: 'validation',message: 'no chatroomid provided'})
    }
})

// testdummy need to remove
router.get('/testdummy', async(req, res)=>{
    console.log(req) 
    // try{
    //     const testmessage1=new MessageModel({from_id: 'test', message: 'hellotheretest1'})
    //     await testmessage1.save()
        
    //     const chatroom=new ChatRoomModel({admin: 'hellothere',participants: ['test', 'test1'], 
    //         messages: [testmessage1]});
    //     await chatroom.save();
    // }catch(err){
    //     console.log(err)
    // }
    res.end()
})

router.get('/endpoll', async(req, res)=>{
    let chatroomid=req.query.chatroomid;
    // get most recent messages from db for chatroomid
    console.log('endpoll called')
    try{
        const messages=await ChatRoomModel.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(chatroomid)}},
            {$unwind: "$messages"},
            {$project: {_id:0, "messages":1 }},
            {$sort: {timestamp: -1}},
            {$limit: 50}
        ])
        // flatten and clean up result
        for(let message of messages){
            delete message.messages['_id']
            delete message.messages['updatedAt']
            message['_id']=message.messages['from_id']
            message['message']=message.messages['message']
            message['createdAt']=message.messages['createdAt']
            delete message.messages
        }
        for(let i=0;i<connectionPool[chatroomid].length;i++){
            let connection=connectionPool[chatroomid].pop()
            connection.json(messages)
        }
        res.end()
    }catch(err){
        res.status(500).json(err)
    }
})
//   const testmessage=new MessageModel({from_id: 'test', message: 'hellotheretest'})
//         await testmessage.save()
//         const testmessage1=new MessageModel({from_id: 'test', message: 'hellotheretest1'})
//         await testmessage1.save()
        
//         const chatroom=new ChatRoomModel({admin: 'test',participants: [{par_id: 'test'}], 
//             messages: [testmessage,testmessage1]});
//         await chatroom.save();


// TODO TEST THIS!!!!
router.post('/sendMessage', async (req, res)=>{
    // get message from query store message
    // on success return all connections in the pool
    // and return the connection with ok message
    // on failure, return to the user 500 and error
    if(!req.body){
        return
    }
    const message=req.body.data.message
    const chatroomid=req.body.params.chatroomid
    if(message && chatroomid){
        ChatRoomModel
        .findByIdAndUpdate(chatroomid,{$push: {messages: {from_id: req.user.username, message: message}}})
        .then(async(data)=>{
                //go through
            const messages=await ChatRoomModel.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(chatroomid)}},
                {$unwind: "$messages"},
                {$project: {_id:0, "messages": 1}},
                {$sort: {timestamp: -1}},
                {$limit: 50}
            ])
            for(let message of messages){
                delete message.messages['_id']
                delete message.messages['updatedAt']
                message['_id']=message.messages['from_id']
                message['message']=message.messages['message']
                message['createdAt']=message.messages['createdAt']
                delete message.messages
            }
            for(let i=0;i<connectionPool[chatroomid].length;i++){
                let connection=connectionPool[chatroomid].pop()
                connection.json(messages)
            }
            res.end()
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json(err)
        })
    }else{
        res.status(500).json({message: "message or chatroom id not set"})
    }
})

//         const chatroom=new ChatRoomModel({admin: 'test',participants: [{par_id: 'test'}], 
//             messages: [testmessage,testmessage1]});
//         await chatroom.save();
router.post('/newChatroom',(req, res)=>{
    if(req.user.username){
        const chatroom=new ChatRoomModel({admin: req.user.username, 
            participants: [req.user.username], messages:[]});
        chatroom.save().then((savedRoom)=>{
            res.send(savedRoom._id)
        }).catch((err)=>{
            console.log(err)
            res.status(500).json({message: 'failed to save to db'})})
    }else{
        //remove this after adding loggedIn middlewear
        res.status(500).json({message: 'No user?'})
    }
})

router.post('/addToChatroom',async (req, res)=>{
    try{
        const result=await ChatRoomModel.findById(req.query.chatroomid)
        if(result.admin==req.user.username){
            //verify user is indeed an user
            const isUser=await UserModel.findOne({username: req.query.usertoadd})
            if(isUser){
                result.participants.push({par_id: req.query.usertoadd})
                let val=await result.save()
                res.json(val.participants.map((participant)=>{
                    return participant.par_id;
                }))
            }else{
                res.status(500).json({message: 'not a user'})
            }
        }else{
            res.status(500).json({message: 'not admin'})
        }
    }catch(err){
        res.status(500).json(err)
    }
})

router.get('/chatroomParticipants', loggedIn, async (req,res)=>{
    try{
        const result=await ChatRoomModel.findById(req.query.chatroomid)
        let flag=false;
        for(let item of result.participants){
            if(item==req.user.username){
                flag=true;
            }
        }
        if(flag){
            res.send(result.participants);
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err)   
    }
})
router.post('/',loggedIn,(req, res)=>{
    console.log(req.body)
})


module.exports=router