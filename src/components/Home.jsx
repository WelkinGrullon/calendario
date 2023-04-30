import { Button } from "react-bootstrap";
import { useContext } from "react";
import { userContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Home(){
    const {isLoggedIn} = useContext(userContext);
    if (isLoggedIn === true){
        return <Navigate to='/groups' />
    }
    return(
        <div style={{height: '80vh'}} className="d-flex align-items-center">
            <div  style={{maxWidth:'700px'}} className="d-flex flex-column container text-center mt-5">
                <h1 className="jumbotron-heading">Calendario</h1>
                <p  className="mt-4">Your one-stop app for planning events in a group. simplify your life by creating groups and sharing your schedule within the groups to always know available dates to plan activities without the stress of scheduling conflicts!</p>
                <div className="d-flex justify-content-center">
                    <Link to='/login'>
                    <Button className="m-1" bg='whtie'>
                        Log In
                    </Button>
                    </Link>
                    <Link to='/signup'>
                    <Button className="m-1">
                        Register
                    </Button>
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}