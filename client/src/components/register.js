import {useEffect,useState} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
function Register(){
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)
    const onSubmit =(e)=>{
        e.preventDefault()
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

    return(
        <>
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
            <button className='btn-login' onClick={(e)=>{
                e.preventDefault();
                setRedirect(true);
            }}>login</button>
        </>
    )
}

export default Register;