import {bindActionCreators, combineReducers} from 'redux'
import {createStore} from 'redux'

const chats=(state=[], action)=>{
    switch(action.type){
        case 'newChats':
            return action.payload;
        default:
            return state;
    }
}

const curChat=(state='', action)=>{
    switch(action.type){
        case 'switchChat':
            return action.payload;
        default:
            return state;
    }
}

const curParticipants=(state=[], action)=>{
    switch(action.type){ 
        case 'newParticipants':
            return action.payload;
        default:
            return state;
    }
}

const curMessages=(state=[], action)=>{
    switch(action.type){
        case 'newMessages':
            return action.payload;
        default:
            return state;   
    }
}


const isLoggedIn=(state=false, action)=>{
    switch(action.type){
        case 'setLoggedIn':
            return true;
        case 'unsetLoggedIn':
            return false;
        default:
            return state;
    }
}

const userlist=(state=[],action)=>{
    switch(action.type){
        case 'setUserList':
            return action.payload;
        default:
            return state;
    }
}

const reducer=combineReducers({userlist, chats, curChat, curParticipants, curMessages, isLoggedIn});
export const store=createStore(reducer);
