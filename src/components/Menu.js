import React, {useState} from 'react';
import './Menu.css';
import {Button, Container, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import QueueSrv from "../services/QueueService";
import { useCookies } from 'react-cookie';

function Menu() {

    const [cookies, setCookie, removeCookie] = useCookies(['userInfo', 'isAuthenticated']);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = (modalIsOpen = undefined) => setIsOpen(modalIsOpen !== undefined ? modalIsOpen:!isOpen);

    const signButton = cookies.isAuthenticated === 'true' ?
        <Button variant="link" onClick={() => QueueSrv.newMessage('signout', true)}>Sign Out</Button>:
        <Button variant="link" onClick={() => QueueSrv.newMessage('toggleSignInModal', true)}>Sign In</Button>;

    return (
        <Navbar bg="light" expand="lg" className={"app-navbar"}>
            <Container>
                <Navbar.Brand href="/" className="app-logo"><img src={'/logo.png'} width={33} alt="logo" aria-hidden="true"/><span>Bookmark</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => toggle()} className={{"sdfsdfsdf": !isOpen}} />
                <Navbar.Collapse  in={isOpen} id="basic-navbar-nav">
                  <Nav className="me-auto app-navbar">
                      <NavItem>
                          <LinkContainer to="/url">
                              <Nav.Link onClick={() => toggle()}>Urls</Nav.Link>
                          </LinkContainer>
                      </NavItem>
                      <NavItem>
                          <Nav.Link onClick={ () => { QueueSrv.newMessage('toggleCreateUrlModal', true); toggle(false); } } >Create Urls</Nav.Link>
                      </NavItem>
                      <NavItem>
                          <LinkContainer to="/category">
                              <Nav.Link onClick={() => toggle()}>Categories</Nav.Link>
                          </LinkContainer>
                      </NavItem>
                      <NavItem>
                          <Nav.Link onClick={ () => { QueueSrv.newMessage('toggleCreateCategModal', true); toggle(false); } } >Create Category</Nav.Link>
                      </NavItem>
                      <NavItem className="signInContainer">
                          <div>
                              <div className="userinfo">
                                  <img src={cookies?.userInfo?.avatar} />{cookies?.userInfo?.login}
                              </div>
                              <div className="signIn">
                                  {signButton}
                              </div>
                          </div>
                      </NavItem>
                  </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;
