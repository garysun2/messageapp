import {useEffect,useState} from 'react'
import { Redirect } from 'react-router-dom'
import { validate } from '../helpers/validate'
import {Menu} from './menu'
import { setLoggedIn } from '../redux/actions'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { store } from '../redux/reducers'

// validate input for username and password
// return an error object


function Login(){
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [error, setError]=useState({})
    const isLoggedIn=useSelector((state)=>state.isLoggedIn)
    const [redirect, setRedirect]=useState(false)
    useEffect(()=>{
        setError(validate({username: username, password: password}));
    },[username, password])

    useEffect(()=>{
        if(isLoggedIn){
            setTimeout(()=>{
                setRedirect(true);
            },1000)
        }
    },[isLoggedIn])

    const onSubmit =async (e)=>{
        e.preventDefault();
        setError(validate({username: username, password: password}));
        console.log(error);
        if((!error.username) && (!error.password)){
            try{
                const res=await axios.post('http://localhost:8000/login',{
                    username: username,
                    password: password
                },
                {withCredentials: true});
                store.dispatch(setLoggedIn());
            }catch(error){
                console.log(error)
                return;
            }
        }
    }


    return(
        <>
            <Menu/>
            {redirect? <Redirect to='/message'/>:''}
            {isLoggedIn?<h1>Logged in redirecting to message...</h1>:<form className="login-form" onSubmit={onSubmit}>
                <div className="form-control">
                    <label>Username</label>
                    <input
                    type='text'
                    placeholder='Enter Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {error.username?<div className='form-error'>{error.username.message}</div>:''}
                <div className="form-control">
                    <label>Password</label>
                    <input
                    type='text'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                {error.password?<div className='form-error'>{error.password.message}</div>:''}
                <input type='submit' value='submit' className='btn' />
            </form>
            }
        </>
    )
}

export default Login;