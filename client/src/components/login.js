import {useEffect,useState} from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

// validate input for username and password
// return an error object
function validate(input){
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

function Login(){
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)
    const [error, setError]=useState({})
    const onBlur=(e)=>{
        e.preventDefault();
        setError(validate({username: username, password: password}));
    }
    const onSubmit =async (e)=>{
        e.preventDefault()
        try{
            const res=await axios.post('http://localhost:8000/login',{
                username: username,
                password: password
            },
            {withCredentials: true});
            setRedirect(true);
        }catch(error){
            console.log(error)
            return;
        }
    }

    return(
        <>
            {redirect? <Redirect to='/message'/>:''}
            <form className="login-form" onSubmit={onSubmit} onBlur={onBlur}>
                <div className="form-control">
                    <label>Username</label>
                    <input
                    type='text'
                    placeholder='Enter Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-control">
                    <label>Password</label>
                    <input
                    type='text'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                <input type='submit' value='submit' className='btn' />
            </form>
        </>
    )
}

export default Login;