import { useConnect } from '@stacks/connect-react';
import React from 'react'
import SignIn from './SignIn';
import {Button, Nav, Navbar, NavbarBrand, NavItem} from 'reactstrap'
import {FiLogOut, FiX, FiAlignJustify} from 'react-icons/fi'

interface Props {
  logOut: () => void
  toggle: () => void
  isOpen: boolean
}

const Auth = ({logOut, toggle, isOpen}: Props) => {
    const { authOptions } = useConnect();
    const { userSession } = authOptions;

    if (!userSession?.isUserSignedIn()) {
        return <SignIn />;
    }

    const userData = userSession.loadUserData();

      return (
        <>
        <NavbarBrand>
          <div style={{display: "flex", alignItems: "center"}}>
          <div className="menuButton">
          <Button style={{height: "40px"}} onClick={toggle}>
      { isOpen ? <FiX /> : <FiAlignJustify /> }
            </Button>
          </div>
            <img className="ml-3" height="50" src="/logo.png" />
          </div>
        </NavbarBrand>
        <Nav>
            <NavItem>
            <span>{userData.username}</span>
            </NavItem>
            <NavItem>
            <Button
          onClick={logOut}
        >
          <FiLogOut />
        </Button>
            </NavItem>
        </Nav>
      </>
      )
} 


const Header = ({logOut, toggle, isOpen}: Props) => {
    return (
        <Navbar>
          <Auth logOut={logOut} toggle={toggle} isOpen={isOpen} />
        </Navbar>
    )
}

export default Header