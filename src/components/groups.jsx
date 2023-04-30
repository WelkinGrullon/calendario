import { Card, Container, Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../contexts/UserContext";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
export default function GroupList(){
    const [showCreateModal, setShowCreateModal] = useState(false)
    const {isLoggedIn, currentUser, setCurrentuser} = useContext(userContext);
    const [leaveModalShow, setLeaveModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false)
    const [theGroups, setGroups] = useState([])
    const [name, setName] = useState('');
    const [addGroupId, setAddGroupId] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [leaveGroup, setLeaveGroup] = useState('');
    const [deleteGroup, setDeleteGroup] = useState('');
    const [alert, setAlert] = useState(false)
    
    useEffect(()=> {
            if (currentUser)
           { (currentUser.groups || []).forEach((group)=>{
                axios.post('https://calendario-back.onrender.com/groups/find', {_id: group}).then(
                    (res)=>{setGroups((groups)=> [...groups, res.data]);}
                ).catch(err => console.log(err))
            });};
            if (!currentUser){
                window.location.reload(false)
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    function createFormSubmit(e){
        e.preventDefault();
        const newGroup = {user: currentUser._id, name}
        axios.post('https://calendario-back.onrender.com/groups/new', newGroup)
        .then((res)=> {
            localStorage.setItem('user',JSON.stringify(res.data));
            setCurrentuser(JSON.parse(localStorage.getItem('user')))
            setShowCreateModal(false);
            setName('');
            window.location.reload(false)
        })
        .catch(err => console.log(err))
    }
    function handleAddGroup(e){
        e.preventDefault();
        axios.post('https://calendario-back.onrender.com/groups/adduser', {group: addGroupId, user: currentUser._id})
        .then((res)=> {
            console.log(res)
            if (res.status === 201){
                setAlert(true);
                setTimeout(()=>setAlert(false),1000)
            } else {
                localStorage.setItem('user', JSON.stringify(res.data));
                setCurrentuser(JSON.parse(localStorage.getItem('user')));
                window.location.reload(false)
            }
           
        });
        setAddGroupId('');
        setShowJoinModal(false)
    };
    function  handleleaveGroup(){
        axios.post('https://calendario-back.onrender.com/groups/leave', {group: leaveGroup, user: currentUser._id})
        .then(res =>{
            localStorage.setItem('user',JSON.stringify(res.data));
            setCurrentuser(JSON.parse(localStorage.getItem('user')))
            setLeaveModalShow(false);
            setLeaveGroup('');
            window.location.reload(false)
        })
    }
    function handleDeleteGroup(){
        axios.post('https://calendario-back.onrender.com/groups/delete', {group: deleteGroup, user: currentUser._id })
        .then(res => {
            localStorage.setItem('user', JSON.stringify(res.data));
            setCurrentuser(res.data)
            setDeleteModalShow(false);
            setDeleteGroup('');
            window.location.reload(false)
        })
    }
    if (isLoggedIn === false){
        return <Navigate to='/' />
    };
    if (!currentUser){
        return <Spinner animation="border"></Spinner>
    }
    return (
        <Container >
            <Alert variant="danger" show={alert}>user already exists in group</Alert>
            <div className="d-flex justify-content-between align-content-center flex-wrap">
            <h1>Groups : </h1>
            <div className="mt-1">
            <Button onClick={()=>setShowCreateModal(true)} >Create Group</Button>
            <Button onClick={()=>setShowJoinModal(true)} className="m-2" >Add Group</Button>
            </div>
      
            </div>
           
            {(currentUser.groups || []).length === 0 && <div className="text-center"><p>You Currently have no groups. <br /><button className="btn btn-link" onClick={()=>setShowJoinModal(true)}>Join One</button>
            or <button onClick={()=>setShowCreateModal(true)} className="btn btn-link"> Create One</button></p></div>}
            {theGroups.length !== 0 && theGroups.map((group)=>{
                return (
                    
                    <Card key={group._id} className="text-center mb-3">
                        <Card.Header>{group.name}</Card.Header>
                        <Card.Body>
                            <p>Users: {group.users.length}</p>
                            <p>Share Code: {group._id}</p>
                            <Link to={`/groups/${group._id}`}><Button>Go To Group</Button></Link>
                            {group.users.length <= 1 ? <Button onClick={()=>{setDeleteModalShow(true);setDeleteGroup(group._id)}} className="m-2">Delete Group</Button> : <Button onClick={()=>{setLeaveModalShow(true);setLeaveGroup(group._id)}} className="m-2">Leave Group</Button>}
                        </Card.Body>
                    </Card>
                    
                )
            })}
                
           
            <Modal show={showCreateModal}>
                <Modal.Header>
                    Create a New Group
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createFormSubmit} >
                        <Form.Group className="mb-3">
                            <Form.Label>Group Name: </Form.Label>
                            <input value={name} onChange={(e)=>setName(e.target.value)} className="form-control" type='text' />
                        </Form.Group>
                        <Form.Group>
                            <Button type="submit">Create</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShowCreateModal(false)} >Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showJoinModal}>
                <Modal.Header>Join an Existing Group</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddGroup} >
                        <Form.Label>Group Share Code: </Form.Label>
                        <input value={addGroupId} onChange={(e)=> setAddGroupId(e.target.value)} type='text' required={true} className="form-control mb-3" />
                        <Button type='submit'>Join Group</Button>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{setShowJoinModal(false);setAddGroupId('')}} >Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={leaveModalShow}>
                <Modal.Header>
                    Leave Group
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to leave this group?</p>
                    <div><Button className="m-2" onClick={()=>setLeaveModalShow(false)}>No</Button><Button className="m-2" onClick={()=>handleleaveGroup()}>Yes</Button></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setLeaveModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deleteModalShow}>
                <Modal.Header>
                    Delete Group
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to delete this group?</p>
                    <div><Button className="m-2" onClick={()=>setDeleteModalShow(false)}>No</Button><Button className="m-2" onClick={()=>handleDeleteGroup()}>Yes</Button></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setDeleteModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}