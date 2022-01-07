import axios from "axios"

export function Logout(props){
    async function onLogout(){
        console.log('here')
        try{
            const res=await axios.post('http://localhost:8000/logout')
        }catch(err){
            console.log(err)
        }
        window.location.reload();
    }
    return <><button type='button' className="btn-logout" onClick={onLogout}>logout</button></>
}