import { UserData, UserSession } from '@stacks/auth';
import { AuthOptions, Connect } from '@stacks/connect-react';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { appConfig } from './utils/constants';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Property from './pages/Property';

const userSession = new UserSession({appConfig})

function App() {
  const [userData, setUserData] = useState<UserData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const authConfigs = {
    redirectTo: "/",
    userSession: userSession,
    onFinish: () => {
      setUserData(userSession.loadUserData());
    },
    appDetails: {
      name: "Stacks",
      icon: "/logo192.png"
    }
  } as unknown as AuthOptions

  useEffect(() => {
    ;(async () => { 
        if (userSession.isSignInPending()) {
          const userData = await userSession.handlePendingSignIn()
          setUserData(userData)
        } else if (userSession.isUserSignedIn()) {
          setUserData(userSession.loadUserData())
        }
    })()
  }, [])

  const handleLogOut = () => {
    setUserData(undefined)
    userSession.signUserOut("/")
    localStorage.clear()
  }

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Connect authOptions={authConfigs}>
      <BrowserRouter>
        <Header logOut={handleLogOut} toggle={toggle} isOpen={isOpen} />  
        <div style={{display: "flex"}}>
          <Sidebar isOpen={isOpen} />
          <div className={`${isOpen ? "card-open" : ""}`} style={{width: "100%"}}>
          <Switch>
            <Route path="/property" component={Property} />
          </Switch>
          </div>
        </div>
      </BrowserRouter>
    </Connect>
  );
}

export default App;
