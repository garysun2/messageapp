export const switchChat=(payload)=>{
    return {type: 'switchChat', payload: payload}
}

export const newChats=(payload)=>{
    return {type: 'newChats', payload: payload};
}

export const newMessages=(payload)=>{
    return {type: 'newMessages', payload: payload};
}

export const newInfo=(payload)=>{
    return {type: 'newParticipants', payload: payload};
}

export const setError=(payload)=>{
    return {type: 'setError', payload: payload};
}

export const setLoggedIn=()=>{
    return {type: 'setLoggedIn'};
}

export const unsetLoggedIn=()=>{
    return {type: 'unsetLoggedIn'};
}