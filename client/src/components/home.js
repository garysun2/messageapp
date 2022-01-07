import react from 'react'
import { Link } from 'react-router-dom';

function Login(){
    return(
        <div>
            <h3>HOME</h3>
            <ul>
                <li><Link to='/register'>Register</Link></li>
                <li><Link to='/login'>Login</Link></li>
            </ul>
        </div>
    )
}

export default Login;