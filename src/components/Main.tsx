import React from "react"
import { Container } from "reactstrap"

interface Props {
    children: any
}

const Main = ({children}: Props) => {
    return (
        <Container className="InvoiceCard">
        <div style={{display: "flex", height: "100%"}}>
            {children}
        </div>
        </Container>
    )
}

export default Main