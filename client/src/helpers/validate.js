export function validate(input){
    const error={}
    if(!/^[a-z0-9]+$/i.test(input.username)){
        error.username={message: 'username needs to be alphanumeric'}
    }
    if(input.username.length>20 || input.username.length<3){
        error.username={message: 'username needs to be between 3 and 20 characters'}
    }
    if(!/^[a-z0-9]+$/i.test(input.password)){
        error.password={message: 'password needs to be alphanumeric'}
    }
    if(input.password.length>20 || input.password.length<3){
        error.password={message: 'password needs to be between 3 and 20 characters'}
    }
    return error;
}