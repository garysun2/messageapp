import {useEffect,useState} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { validate } from '../helpers/validate'
import {Menu} from './menu'

function Register(){
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)
    const [error, setError]=useState({})
    
    useEffect(()=>{
        setError(validate({username: username, password: password}));
    },[username, password])
    
    const onSubmit =(e)=>{
        e.preventDefault()
        setError(validate({username: username, password: password}));
        if((!error.username) && (!error.password)){
            axios.post('http://localhost:8000/register',{
                username: username,
                password: password
            }).then((res)=>{
                setRedirect(true)
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    return(
        <>
            <Menu/>
            {redirect?<Redirect to='/login'/>:''}
            <form className="register-form" onSubmit={onSubmit}>
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
        </>
    )
}

export default Register;