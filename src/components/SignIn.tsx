import { useConnect } from "@stacks/connect-react"
import React from 'react'

const SignIn = () => {
    const {doOpenAuth} = useConnect()
    return <button onClick={() => doOpenAuth(true)}>SignIn</button>
}

export default SignIn