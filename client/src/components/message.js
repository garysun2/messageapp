import {useState, useEffect, useMemo, useCallback} from 'react'
import axios from 'axios'
import {useSelector, shallowEqual} from 'react-redux'
import {store} from '../redux/reducers'
import {switchChat,newChats, newMessages, newInfo} from '../redux/actions'
import {Logout} from './logout'
axios.defaults.withCredentials=true

// TODO: standardize error handling, keep error state in redux store
// list of current error types need to standardize on server side,
// not authorized: login issue should display on current page to login
// 

// Chats component for displaying list of chats
// Component should include the ChatsList left side component
// and AdditionalInfo right side component for displaying
// members and additional function such as adding member
// as well as the primary MessageWindow for displaying messages
function ChatWindow(){
    return (
        <div><ChatsList/><MessageWindow/><AdditionalInfo/></div>
    )
}

function ChatsList(props){
// on load request to server for list of chatrooms
// list chatrooms as list of buttons
// buttons affect MessageWindow and AdditionalInfo
    const chats=useSelector((state)=>state.chats, shallowEqual);
    const [error, setError]=useState({})
    const [isLoading, setLoading]=useState(true)
    var keycounter=0;
    useEffect(()=>{
        //get chats from api
        async function fetchdata(){
            try{
                const res=await axios.get('http://localhost:8000/message/chatrooms')
                store.dispatch(newChats(res.data));
                store.dispatch(switchChat(chats[0]));
                setLoading(false);
            }catch(err){
                setError(err)
            }
        }
        fetchdata();
    }  
    ,[chats])

    return (
        <div>{isLoading?'isLoading':chats.map(
            (item)=>{
                keycounter++;
                return <li key={keycounter}>{item}</li>})}
        </div>
    )
}

function AdditionalInfo(props){
    const curChat=useSelector((state)=>state.curChat, shallowEqual);
    const curParticipants=useSelector((state)=>state.curParticipants);
    const [isLoading, setLoading]=useState(true)
    var counter=0;
    useEffect(()=>{
        async function getParticipants(){
            if(curChat!=''){
                try{
                    const result=await axios.get('http://localhost:8000/message/chatroomParticipants',
                    {params: {chatroomid: curChat}});
                    store.dispatch(newInfo(result.data));
                    setLoading(false);
                }catch(err){
                    console.log(err)
                }
            }
        }
        getParticipants();
    },[curChat])

    return (<>curParticipants is 
    {isLoading?"Loading":curParticipants.map((item)=>{
        counter++;
        return <li key={counter}>{item}</li>})}
    </>)
}

function MessageSubmissionWindow(props){
    const [message, setMessage]=useState('')
    //onSubmit will have to call api to send a message with current chatid and message
    const onSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('http://localhost:8000/message/sendMessage',
            {params: {chatroomid: props.curChat},
            data: {message: message}});
        }catch(err){
            console.log(err)
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
    const curChat=useSelector((state)=>state.curChat);
    const curMessages=useSelector((state)=>state.curMessages);
    const [isFirstPoll, setIsFirstPoll]=useState(true)
    var counter=0;
    useEffect(()=>{
        // used to reference timeout for cleanup
        if(curChat!=''){
            let timeout=null;
            async function poll(){
                try{
                    const res=await axios.get('http://localhost:8000/message/longpoll',
                    {params: {chatroomid: curChat}})
                    store.dispatch(newMessages(res.data));
                    console.log(res);
                }catch(err){
                    console.log(err);
                }
                timeout=setTimeout(poll,500)
            }
            async function endpoll(){
                try{
                    const res=await axios.get('http://localhost:8000/message/endpoll',
                    {params: {chatroomid: curChat}})
                    console.log(res);
                }catch(err){
                    console.log(err);
                }
            }
            poll();
            if(isFirstPoll){
                endpoll();
                setIsFirstPoll(false);
            }
            return ()=>clearTimeout(timeout);
        }
    }, [curChat,isFirstPoll])

    // onmount calls the endpoll functions to immediately endpoll and return list of messages

    return (
        <div className='message-window'>
            <ul>{curMessages?curMessages.map((item)=><li key={item.createdAt}>{item.message}</li>):'No Message'}</ul>
            <MessageSubmissionWindow curChat={curChat}/>
        </div>
    )
}


//when first loading this whole component need to send
//API request to message on server side, if 500 status
//code is returned needs to handle error and redirect to login
function Message(){
    return <><ChatWindow/><Logout/></>    
}

export {Message}