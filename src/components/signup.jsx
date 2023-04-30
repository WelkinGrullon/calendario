import { Spinner, Form, Container, Button, Alert} from "react-bootstrap"
import { useEffect, useState} from "react";
import axios from 'axios';
import { userContext } from "../contexts/UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
export default function Signup(){
    const {isLoggedIn} = useContext(userContext)
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState();
    const [result, setResult] = useState(false);
    const [failure, setFailure] = useState(false)
    const [fName, setfName] = useState();
    const [lName, setlName] = useState();
    const [confirmPass, setConfirmPass] = useState('');
    const [emailErrors, setEmailErrors] = useState();
    const [passErrors, setPassErrors] = useState()
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function handleFormSubmit(e){
        e.preventDefault();
        setLoading(true);
        const allData =  {
            email : email,
            fName : fName,
            lName : lName,password : password
           }
       axios.post('https://calendario-back.onrender.com/users/new', allData)
       .then(data => console.log(data))
       .then((response)=> { console.log(response)
        setResult(true);setFailure(false)
        setEmail('');
        setfName('');
        setlName('');
        setPassword('');
        setConfirmPass('')})
       .catch(function(error){
        console.log(error)
        setEmailErrors(error.response.data.errors.email);
        setPassErrors(error.response.data.errors.password)
        setFailure(true);
        setResult(false)});

       setTimeout(()=>{
        setLoading(false)
        navigate('/login')
       },1000)
       
    };
    
    useEffect(()=>{
        setTimeout(()=>{
            if (isLoggedIn === true){
                navigate('/groups')
            }
        },200)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isLoggedIn])

    return (
        <div style={{height:'100%'}} className="d-flex align-self-center ml-1 mr-1">
        <Container style={{maxWidth:'500px', maxHeight:'100%'}}
        className="mt-0 mb-0 p-4 border border-primary rounded"
        >
            <h1 className="mb-1">Please Sign Up</h1>
            <Alert className="" variant='success' show={result}>Successfully Created Account!</Alert>
            <Alert variant='danger' show={failure}>{emailErrors + passErrors}</Alert>
            <Form onSubmit={(e)=> {handleFormSubmit(e);}} >
                <Form.Group  className="mb-2">
                    <Form.Label htmlFor='email' >
                        Email
                    </Form.Label>
                    <input className="form-control"
                    value={email}
                      name='email' 
                      required={true}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email" type='email' />
                </Form.Group>
                <Form.Group  className="mb-2">
                    <Form.Label htmlFor='fName'>
                        First Name
                    </Form.Label>
                    <input
                    className="form-control"
                    required={true}
                    type='text' 
                    value={fName}
                    onChange={e => setfName(e.target.value)}
                    name='fName' />
                </Form.Group>
                <Form.Group  className="mb-2">
                    <Form.Label htmlFor='lName'>
                        Last Name
                    </Form.Label>
                    <input
                    className="form-control"
                    name='lName'
                    required={true}
                    value={lName}
                    onChange={e => setlName(e.target.value)}
                    type='text' />
                </Form.Group>
                <Form.Group   className="mb-2">
                    <Form.Label htmlFor='password'>
                        Password 
                    </Form.Label>
                    <input
                    className="form-control"
                    type='password'
                    required={true}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    name='password'
                    id='password' />
                    <Form.Label className="text-danger" visuallyHidden={([...password].length >= 6 || [...password].length < 1)}>
                    * Must be 6 characters long or more
                    </Form.Label>
                </Form.Group>
                <Form.Group   className="mb-2">
                    <Form.Label htmlFor='confpassword'>
                        Confirm Password
                    </Form.Label>
                   
                    <input
                    className="form-control mb-2"
                    type='password'
                    required={true}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    name='confpassword' />
                     <Form.Label visuallyHidden={(password === confirmPass)}className="text-danger" >*Passwords must Match</Form.Label>
                </Form.Group>
                <Button disabled={!(password === confirmPass && [...password].length >= 6 )} type='submit' className="w-100 mb-2">
                   {loading ? <Spinner animation='border' /> : 'Sign Up'}
                </Button>
                <p>
                    Already have an account? <Link to='/login'>Login</Link>
                </p>
            </Form>
        </Container> 
        </div>
    )
}