import { UserData, UserSession } from '@stacks/auth';
import { AuthOptions, Connect } from '@stacks/connect-react';
import React, { useEffect, useState } from 'react';
import SignIn from './components/SignIn';
import { appConfig } from './utils/constants';
import { fetchKeyPair, saveKeyPair } from './utils/data-store';

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
          console.log("here");
          
          setUserData(userSession.loadUserData())
          console.log(await saveKeyPair(userSession, "test-info", false));
          
          console.log(await fetchKeyPair(userSession));
          
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
        <div>
          <SignIn />
        </div>
    </Connect>
  );
}

export default App;
