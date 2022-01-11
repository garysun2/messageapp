import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import {useSelector, shallowEqual} from 'react-redux'
import {store} from '../redux/reducers'
import {switchChat,newChats, newMessages, newInfo} from '../redux/actions'
import {Menu} from './menu'
import {Redirect} from 'react-router-dom'
axios.defaults.withCredentials=true

// TODO: standardize error handling, keep error state in redux store
// list of current error types need to standardize on server side,
// not authorized: login issue should display on current page to login
//

Object.defineProperty(Object.prototype, 'isEmpty', {
    get() {
        for(var p in this) {
            if (this.hasOwnProperty(p)) {return false}
        }
        return true;
    }
});

var controller=new AbortController();
//when first loading this whole component need to send
//API request to message on server side, if 500 status
//code is returned needs to handle error and redirect to login
function Message(){
    const isLoggedIn=useSelector((state)=>state.isLoggedIn);
    const [redirect, setRedirect]=useState(false);
    useEffect(()=>{
        if(!isLoggedIn){
            setTimeout(()=>{
                setRedirect(true)
            },1000);
        }
    },[isLoggedIn])
    return (
        <>
            {redirect? <Redirect to='/login'/>:''}
            {isLoggedIn?<><ChatWindow/></>:'Not logged in, redirecting to login page...'}
            <Menu/>
        </>
    )    
}
// Chats component for displaying list of chats
// Component should include the ChatsList left side component
// and AdditionalInfo right side component for displaying
// members and additional function such as adding member
// as well as the primary MessageWindow for displaying messages
function ChatWindow(){
    const [error, setError]=useState({})
    useEffect(()=>{
        //get chats from api
        function fetchdata(){
            axios.get('http://localhost:8000/message/chatrooms').then((res)=>{
                    store.dispatch(newChats(res.data));
                    if(res.data[0]!=null){
                        store.dispatch(switchChat(res.data[0]));
                    }
                }
            ).catch((err)=>{
                setError(err);
            })
        }
        fetchdata();
        console.log(error)
    }  
    ,[])  
//<Error error={error} setError={setError}/>
    useEffect(()=>{
        console.log(error.isEmpty);
    },[error])
    return (
        <div>{(!error.isEmpty)?<Error error={error} setError={setError}/>:
            <React.Fragment>
                <ChatsList setError={setError}/>
                <MessageWindow setError={setError}/>
                <AdditionalInfo setError={setError}/>
            </React.Fragment>}
        </div>
    )
}

function Error(props){
    return (
        <h1>{"Server Error: "+props.error.response.data.message}</h1>
    )   
}

async function fetchParticipants(chatroomid){
    try{
        const res=await axios.get('http://localhost:8000/message/chatroomParticipants',
        {params: {chatroomid: chatroomid}});
        store.dispatch(newInfo(res.data));
    }catch(err){
        console.log(err);
        throw err;
    }
}

function Button(props){
    const curChat=useSelector((state)=>state.curChat, shallowEqual); 
    function onClick(e){
        e.preventDefault();
        if(props.children != curChat){
            // cancel all revious requests
            try{
                console.log('abort')
                controller.abort();
                controller=new AbortController();
                // start new poll with new chatroom  
                store.dispatch(switchChat(props.children));
                fetchParticipants(props.children);
                poll(props.children, controller);
                //manually endpoll for first results
                endpoll(props.children);
            }catch(err){
                props.setError(err);
            }
        }
    }
    return(
        <div className='btn-chatlist'><button onClick={onClick}>{props.children}</button></div>
    )
}


async function poll(chatroomid, controller){
    try{
        const res=await axios.get('http://localhost:8000/message/longpoll',
        {params: {chatroomid: chatroomid},
        signal: controller.signal});
        store.dispatch(newMessages(res.data));
        setTimeout(poll.bind(null, chatroomid, controller),500);
    }catch(err){
        console.log(err);
    }
}

 async function endpoll(chatroomid){
    try{
        const res=await axios.get('http://localhost:8000/message/endpoll',
        {params: {chatroomid: chatroomid}})
    }catch(err){
        console.log(err);
    }
}


function ChatsList(props){
    const chats=useSelector((state)=>state.chats, shallowEqual);
    var keycounter=0;
    useEffect(()=>{
        if(chats[0]!=null && chats[0]!=''){
            try{
                controller.abort();
                controller=new AbortController();
                poll(chats[0], controller);
                endpoll(chats[0]);
                fetchParticipants(chats[0]);
            }catch(err){
                props.setError(err);
            }
       }
    }  
    ,[chats])

    return (
        <div>{(chats&&chats!=[])?chats.map(
            (item)=>{
                keycounter++;
                return <li key={keycounter}><Button setError={props.setError}>{item}</Button></li>}): 'is loading'}
        </div>
    )
}

function AdditionalInfo(props){
    const curParticipants=useSelector((state)=>state.curParticipants);
    var counter=0;
    return (<>curParticipants is 
    {(curParticipants!=null&& curParticipants!=[])?curParticipants.map((item)=>{
        counter++;
        return <li key={counter}>{item}</li>}):'is loading'}
    </>)
}

function MessageSubmissionWindow(props){
    const [message, setMessage]=useState('')
    const curChat=useSelector((state)=>state.curChat)
    //onSubmit will have to call api to send a message with current chatid and message
    const onSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('http://localhost:8000/message/sendMessage',
            {params: {chatroomid: curChat},
            data: {message: message}});
        }catch(err){
            console.log(err);
            props.setError(err);
        }
    }
    return (
        <form className="message-submission" onSubmit={onSubmit}>
            <div className="form-control">
                <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <input type='submit' value='submit' className='btn' />
        </form>
    )
}

function MessageWindow(props){
    const curMessages=useSelector((state)=>state.curMessages);
    var counter=0;

    return (
        <div className='message-window'>
            <ul>{curMessages?curMessages.map((item)=><li key={item.createdAt}>{item.message}</li>):'No Message'}</ul>
            <MessageSubmissionWindow setError={props.setError}/>
        </div>
    )
}



export {Message}