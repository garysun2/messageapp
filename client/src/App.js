import Login from './components/login'
import Register from './components/register'
import Home from './components/home'
import NotFound from './components/404'
import {Message } from './components/message'
import {Route,Redirect,BrowserRouter,Switch} from 'react-router-dom'



const globalstyle={
  position: 'fixed',
  height: '100vh',
  width: '100vw'
}

function App() {
  return (
    <div style={globalstyle}>
    <BrowserRouter>
      <Switch>
        <Route exact  path='/' component={Home}/>
        <Route exact  path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/message' component={Message}/>
        <Route exact path='/404' component={NotFound}/>
        <Redirect to='/404'/>
      </Switch>
    </BrowserRouter>
    </div>
  )
}

export default App;
