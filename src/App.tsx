import { UserData, UserSession } from '@stacks/auth';
import { AuthOptions, Connect } from '@stacks/connect-react';
import React, { useCallback, useEffect, useState } from 'react';
import SignIn from './components/SignIn';
import { appConfig } from './utils/constants';
import { fetchKeyPair, saveKeyPair } from './utils/data-store';
//@ts-ignore
import Orm from 'bigchaindb-orm'

const userSession = new UserSession({appConfig})

function App() {
  const [userData, setUserData] = useState<UserData>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [pup, setPup] = useState<string>()
  const [priv, setPriv] = useState<string>()
  const [posts, setPosts] = useState<string[]>([])

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
      setIsLoggedIn(true)
    },
    appDetails: {
      name: "Stacks",
      icon: "/logo192.png"
    }
  } as unknown as AuthOptions

  const setInitData = useCallback(async () => {
    const localPup = localStorage.getItem('pup')
    const localPriv = localStorage.getItem('priv')
    if (localPup && localPriv) {
      setPup(localPup)
      setPriv(localPriv)
    }  else {
      const json =  await fetchKeyPair(userSession)
      //@ts-ignore
      if (json && json.keyPair) {
        //@ts-ignore
        const savedPup =  json.keyPair.publicKey
        //@ts-ignore
        const savedPriv = json.keyPair.privateKey
        setPup(savedPup)
        setPriv(savedPriv)
      } else {
        const newP = new bdbOrm.driver.Ed25519Keypair()
        saveKeyPair(userSession, newP, false)
      }
    }
  }, [bdbOrm.driver.Ed25519Keypair])

  useEffect(() => {
    if (pup && priv) {      
      bdbOrm.models.post.retrieve().then((assets: any) => {
        console.log(assets)
        setPosts(assets.map((e: { data: { message: any; }; }) => e.data.message))
      })
    }
  }, [pup, priv])

  useEffect(() => {   
    ;(async () => {
        if (userSession.isSignInPending()) {
          const userData = await userSession.handlePendingSignIn()
          setUserData(userData)
          setIsLoggedIn(true)
          setInitData()
        } else if (userSession.isUserSignedIn()) {          
          setUserData(userSession.loadUserData())     
          setIsLoggedIn(true)            
          setInitData()   
        }else {
          setIsLoggedIn(false)
        }
    })()
  }, [setInitData])

  const sendPost = () => {
    if (pup && priv) {
      bdbOrm.models.post.create({
        keypair: {publicKey: pup, privateKey: priv},
        data: {message: "hello dfghgdfhdfghdfgh"}
      }).then((asset: any) => console.log(asset))
    }
  }

  const handleLogOut = () => {
    setUserData(undefined)
    setIsLoggedIn(false)
    userSession.signUserOut("/")
    localStorage.clear()
  }

  return (
    <Connect authOptions={authConfigs}>
          {isLoggedIn !== undefined && (
            <div>
              {isLoggedIn ? <button onClick={handleLogOut}>LogOut</button> : <SignIn />}
              <button onClick={sendPost}>Post</button>
              <ul>
          {posts && posts.map((p) => <li>{p}</li>)}
              </ul>
            </div>
          )            
          }
    </Connect>
  );
}

export default App;
