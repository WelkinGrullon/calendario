import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line react-hooks/exhaustive-deps
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react' ;
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useContext } from 'react';
import { userContext } from '../contexts/UserContext.js';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Calendario(){
  const [showModal, setShowModal] = useState(false);
  const calendarRef = useRef(null);
  const params = useParams();
  const {currentUser, isLoggedIn, userAuthed } = useContext(userContext);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [sunday, setSunday] = useState(false)
  const [monday ,setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false)
  const olddaysOfWeek = ['',sunday ? 0 : '',monday ? 1 : '', tuesday ? 2 : '', wednesday ? 3 : '', thursday ? 4 : '', friday ? 5 : '', saturday ? 6 : ''];
  const daysOfWeek = olddaysOfWeek.filter(day => {
    return day !== ''
  });
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const [modalStart, setModalStart] = useState('');
  const [modalDesc, setModalDesc]  = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalEnd, setModalEnd] = useState('');
  const author = currentUser._id;
  const [display, setDisplay] = useState('auto')
  const [createModalShow, setCreateModalShow] = useState(false)
  const [modalHeader, setModalHeader] = useState('');
  const [theEvents, setEvents] = useState('');
  useEffect(()=>{
    axios.post('https://calendario-app.herokuapp.com/groups/find', {_id: params.id})
    .then((res)=>{
      res.data.users.forEach((user)=>{
        axios.post('https://calendario-app.herokuapp.com/users/find', {user: user})
        .then((res)=>{
          const events = res.data.events
          setEvents((oldEvents)=>[...oldEvents, ...events ]);
          const calendarApi = calendarRef.current.getApi();
          calendarApi.addEvent(res.data.events)
        });

      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  function handleEventClick(event){
    setShowModal(true);
    setModalStart('Start: ' +event.event.start.toLocaleDateString('en-US', options) + ' at ' + event.event.start.toLocaleTimeString([], {hour:'numeric', minute: '2-digit'}));
    setModalEnd(()=> {
      if (event.event.end){
        setModalEnd('End: ' +event.event.end.toLocaleDateString('en-US', options) + ' at ' + event.event.end.toLocaleTimeString([], {hour:'numeric', minute: '2-digit'}))
      }
    })
    setModalHeader(currentUser.fName + ' - '+ event.event.title);
    if (event.event.extendedProps.description){
      setModalDesc(`Description: ${event.event.extendedProps.description}`);
    }
    if (event.event.extendedProps.personalNotes){
      if (currentUser._id === event.event.extendedProps.author){
        setModalNotes(`Personal Notes: ${event.event.extendedProps.personalNotes}`)
      }
    }
    
  }
  useEffect(()=>{
    setTimeout(()=>{
      if (isLoggedIn !== true){
        return <Navigate to='/' />
      }
    },1000)
  },[isLoggedIn]);

  async function handleFormSubmit(e){
    e.preventDefault();
    const alData = {title, start, allDay, display, end, description, personalNotes, author, daysOfWeek : recurring ? daysOfWeek : ''};
    await axios.post('https://calendario-app.herokuapp.com/eventAdd', alData)
    .then(async (res) => {console.log(res);
    setEvents((events)=>[...events, alData]);
    localStorage.setItem('user', JSON.stringify(res.data))
    userAuthed();
    setTitle(''); setStart('');setAllDay(false); setDisplay('auto'); setEnd('');setDescription('');setPersonalNotes(''); setRecurring(false);
    setSunday(false);
          setMonday(false);
          setTuesday(false);
          setWednesday(false);
          setThursday(false);
          setFriday(false);
          setSaturday(false)
     
     
      setCreateModalShow(false);
    }
    
    ).catch(err => console.log(err))
  };
  useEffect(()=>{
    if (recurring === false){
      setDisplay('auto');
      setSunday(false);
          setMonday(false);
          setTuesday(false);
          setWednesday(false);
          setThursday(false);
          setFriday(false);
          setSaturday(false)
    } else {setDisplay('background')}
  },[recurring]);

  useEffect(()=>{
    userAuthed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theEvents]);

  setTimeout(()=>{},200)
  return (
    <Container fluid>
      <FullCalendar 
      ref={calendarRef}
      customButtons={{
        myCustomButton: {
            text: '!',
            icon: 'plus-circle-fill',
            click: ()=>setCreateModalShow(true)
        },
    }}
      eventClick={handleEventClick}
      plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next,myCustomButton',
        center: '',
        right: 'title'
      }}
      events={theEvents}
      footerToolbar={{
        left:'today',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      height={'83vh'}
      themeSystem='bootstrap5'
      initialDate={new Date()}
      
      />
      <Modal show={showModal}>
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Body>
          {modalStart}<br />
          {modalEnd}
        </Modal.Body>
        <Modal.Body>
          {modalDesc}<br />
          {modalNotes}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={createModalShow}>
        <Modal.Header>Create New Event</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>
                Title
              </Form.Label>
              <input value={title} onChange={(e)=>{
                setTitle(e.target.value)
              }} type='text' className='form-control' />
              
            </Form.Group>
            <Form.Group>
            <Form.Label className='' >
                All Day
              </Form.Label>
              <input value={allDay} onChange={(e)=>{
                setAllDay(!allDay)
              }} className='form-check-input m-1' type='checkbox' />
              <br />
              <Form.Label>Recurring</Form.Label>
              <input value={recurring} onChange={()=>setRecurring((current)=>!current)} className='form-check-input m-1' type='checkbox' />
              </Form.Group>
              <Form.Group hidden={!recurring} >
                <Form.Check  label='Sunday' type='switch' onChange={()=>setSunday((day)=>!day)} />
                <Form.Check  label='Monday' type='switch' onChange={()=>setMonday((day)=>!day)} />
                <Form.Check  label='Tuesday' type='switch' onChange={()=>setTuesday((day)=>!day)} />
                <Form.Check  label='Wednesday' type='switch' onChange={()=>setWednesday((day)=>!day)} />
                <Form.Check  label='Thursday' type='switch' onChange={()=>setThursday((day)=>!day)} />
                <Form.Check  label='Friday' type='switch' onChange={()=>setFriday((day)=>!day)} />
                <Form.Check  label='Saturday' type='switch' onChange={()=>setSaturday((day)=>!day)} />
              </Form.Group>
            <Form.Group>
              <Form.Label>Start Date & Time : --</Form.Label>
              <input value={start} onChange={(e)=>setStart(e.target.value)} type='datetime-local' max='9999-12-31' />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                End Date & Time: --
              </Form.Label>
              <input value={end} required={true} onChange={(e)=>setEnd(e.target.value)} type='datetime-local' />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Label>Description: </Form.Label><br />
              <input className='form-control' type='text' value={description} onChange={(e)=>setDescription(e.target.value)} /> <br />
              <Form.Label>
                Personal Notes: 
              </Form.Label><br />
              <input className='form-control' placeholder='Only You Can See this' type='text' value={personalNotes} onChange={(e)=>setPersonalNotes(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Button type='submit'>Add Event</Button>
            </Form.Group>
           
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setCreateModalShow(false);
          setTitle('');
          setStart('');
          setEnd('');
          setAllDay(false);
          setRecurring(false);
          setSunday(false);
          setMonday(false);
          setTuesday(false);
          setWednesday(false);
          setThursday(false);
          setFriday(false);
          setSaturday(false)
          setDescription('');
          setPersonalNotes('')
          
          }}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )

}
