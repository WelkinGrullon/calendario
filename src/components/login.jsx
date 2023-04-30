import { useState, useContext } from 'react';
import {Form, Button, Container, Alert} from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Spinner} from 'react-bootstrap';
import { userContext } from '../contexts/UserContext';
export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [ifError, setIfError] = useState(false);
    const [logErrorMess, setLogErrorMess] = useState('');
    const {isLoggedIn, setIsLoggedIn, userAuthed} = useContext(userContext);
    const handleSubmit = function(e){
        e.preventDefault();
        setLoading(false);
        axios.post('https://calendario-app.herokuapp.com/users', {email, password})
        .then(res => {
            console.log(res)
            if (res.data.status === 'error'){
                setIfError(true);
                setLogErrorMess(res.data.error)
            } else {
                setIfError(false);
                localStorage.setItem('user', JSON.stringify(res.data.result))
                localStorage.setItem('token',res.data.token)
                userAuthed();
                navigate('/groups');
                setIsLoggedIn(true)
                
                
                
            }
        })
        //.then(data => console.log(data))
        .catch(err => console.log(err))
    };
    if (isLoggedIn === true){
        return <Navigate to='/groups' />
    }
    return (
        <div style={{height:'90vh'}} className="d-flex align-self-center ml-2 mr-2">
        <Container style={{maxWidth:'500px', maxHeight:'80%'}}
        className="d-flex flex-column mt-1 p-5 border border-primary rounded">
            <h1 className="mb-5">Please Login</h1>
            <Alert className="" variant='danger' show={ifError}>{logErrorMess}</Alert>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Label >
                        Email
                    </Form.Label>
                    <input placeholder='demo email: demo@email.com'
                    className="form-control"
                    type='email'
                    required={true}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    name='email' />
                </Form.Group>
                
                <Form.Group className="mb-4">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <input
                    className="form-control"
                    placeholder='demo password: test1234'
                    type='password'
                    required={true}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    name='password' />
                </Form.Group>
                <Button type='submit' disabled={loading} className="w-100 mb-2">
                    {loading ? <Spinner animation='border' /> : 'Login'}
                </Button>
                <p>
                    Don't have an account? <Link to='/signup'>Sign up</Link>
                </p>
            </Form>
        </Container> 
        </div>
    )
}