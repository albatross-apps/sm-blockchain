import React from 'react'
import { Link } from 'react-router-dom'

interface SideLink {
    label: string 
    link: string 
    icon?: string
}

interface Props {
    isOpen: boolean
}

const links = [
    {label: "Property", link: "/property"},
    {label: "Invoice", link: "/"}
] as SideLink[]

const Sidebar = ({isOpen}: Props) => {
    return <div className={`${isOpen ? "mobile-sidebar" : "sidebar"} pl-3 pr-3 pt-4`}>
        {links.map((link, i) => <Link key={i} className="p-2" to={link.link}>{link.label.toUpperCase()}</Link>)}
    </div>
}

export default Sidebar