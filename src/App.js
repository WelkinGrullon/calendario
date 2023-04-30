// eslint-disable-next-line react-hooks/exhaustive-deps
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import Calendario from './components/calendar';
import Home from './components/Home';
import axios from 'axios';
import Login from './components/login';
import { userContext } from './contexts/UserContext';
import Navbars from './components/navbar';
import Signup from './components/signup';
import GroupList from './components/groups';
import NotFound from './components/NotFound';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) ;
  const [modalShow, setModalShow] = useState(false);
  const [currentUser, setCurrentuser] = useState('');
  const  userAuthed = () => {
    axios.get('https://calendario-app.herokuapp.com/authUser', {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    }).then((res) => {
      if (res.data === true){
         setIsLoggedIn(true);
         setCurrentuser(JSON.parse(localStorage.getItem('user')));

        
      }})
  };
  useEffect(()=>{
    userAuthed()
    setInterval(()=>{
      userAuthed()
    },300000)
  },[])
  return (
  <userContext.Provider value={{ isLoggedIn, setIsLoggedIn, userAuthed, modalShow, setModalShow, currentUser, setCurrentuser}}>
    <BrowserRouter>
      <Navbars  />
      <Routes>
        <Route path='/groups' element={<GroupList />} ></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/groups/:id' element={<Calendario />}></Route>
        <Route path='/signup' element={<Signup />} ></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  </userContext.Provider>
   
  );
}
export default App;