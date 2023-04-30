import {Navbar, Nav, Button, Modal} from 'react-bootstrap';
import { useContext, useState } from 'react';
import { userContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
export default function  Navbars(){
    const navigate = useNavigate();
    const [logoutForm, setLogoutForm] = useState(false)
    const {isLoggedIn,setIsLoggedIn, setCurrentuser} = useContext(userContext);
    function logger(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCurrentuser('');
        navigate('/')
    }
    return (
        <div>
        <Navbar className='d-flex justify-content-between align-content-center' variant='light' bg='transparent' expand='md' >
            <Navbar.Brand href={isLoggedIn ? '/groups' : '/home'}>
                Calendar.io
            </Navbar.Brand>
            <Nav>
                {isLoggedIn && <Button className='m-2' onClick={()=>setLogoutForm(true)} >Logout</Button>}
                
            </Nav>
        </Navbar>
        <Modal show={logoutForm}>
            <Modal.Header>Log Out?</Modal.Header>
            <Modal.Body className='text-center'>
                <p>Are you sure you want to log out?</p>
                <div>
                    <Button onClick={()=> setLogoutForm(false)} className='m-2'>No</Button>
                    <Button className='m-2' onClick={()=> {logger();setLogoutForm(false)}}>Yes</Button>
                </div>
            </Modal.Body>
            <Modal.Footer><Button onClick={()=>setLogoutForm(false)}>Close</Button></Modal.Footer>
        </Modal>
        
        </div>
    )
}