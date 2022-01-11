import axios from "axios"
import { unsetLoggedIn } from "../redux/actions";
import {store} from '../redux/reducers'
export function Logout(props){
    async function onLogout(){
        try{
            const res=await axios.post('http://localhost:8000/logout')
            store.dispatch(unsetLoggedIn());
        }catch(err){
            console.log(err)
        }
        window.location.reload();
    }
    return <><button type='button' className="btn-menu" onClick={onLogout}>logout</button></>
}