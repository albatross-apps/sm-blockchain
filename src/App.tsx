import { UserData, UserSession } from '@stacks/auth';
import { AuthOptions, Connect } from '@stacks/connect-react';
import React, { useEffect, useState } from 'react';
import SignIn from './components/SignIn';
import { appConfig } from './utils/constants';
import { fetchKeyPair, saveKeyPair } from './utils/data-store';
//@ts-ignore
import Orm from 'bigchaindb-orm'

const userSession = new UserSession({appConfig})

function App() {
  const [userData, setUserData] = useState<UserData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [pup, setPup] = useState<string>()
  const [priv, setPriv] = useState<string>()

  const bdbOrm = new Orm(
      "https://test.ipdb.io/api/v1/"
  )

  bdbOrm.define("post")
  bdbOrm.define("comment")
  
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
    const localPup = localStorage.getItem('pup')
    const localPriv = localStorage.getItem('priv')
    if (localPup && localPriv) {
      setPup(localPup)
      setPriv(localPriv)
      bdbOrm.models.post.create({
        keypair: {publicKey: localPup, privateKey: localPriv},
        data: { key: {message: "dfsgfsdgsdfgsfdg"}}
      })
      bdbOrm.models.post.retrieve().then((p: any) => console.log(p))
    }  else {
      const newP = new bdbOrm.driver.Ed25519Keypair()
      const pup = newP.publicKey
      const priv = newP.privateKey
      localStorage.setItem('pup', pup)
      localStorage.setItem('priv', priv)
    }
    ;(async () => { 
        if (userSession.isSignInPending()) {
          const userData = await userSession.handlePendingSignIn()
          setUserData(userData)
        } else if (userSession.isUserSignedIn()) {          
          setUserData(userSession.loadUserData())                    
        }
    })()
  }, [bdbOrm.driver.Ed25519Keypair])

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
