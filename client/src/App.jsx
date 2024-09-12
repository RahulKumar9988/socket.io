import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, TextField } from '@mui/material'

function App() {
  const socket = useMemo(()=>io('http://localhost:3000/'), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [chat, setChat] = useState([]);
  const [roomName, setRoomName] = useState("");



  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit('message', {message, room});
    setMessage("");
  }

  const joinRoomHandler = (e)=>{
    socket.emit('join-room', roomName);
  }
  useEffect(()=>{

    socket.on("connect", ()=>{
      setSocketId(socket.id);
      console.log('connected', socket.id);
      
    })
    socket.on("recevie-message",(message)=>{
      console.log(message);
      setChat((chat) => [...chat,message])
      
    })

    return()=>{
      socket.disconnect();
    }
  },[])
  return (
    <Container>
      <h1> Welcime to socket.IO</h1>
      <div>
        {socketId}
      </div>
      <form onSubmit={joinRoomHandler}>
        <div>
          <input type="text" value={roomName} placeholder='room name' onChange={(e)=>{
            setRoomName(e.target.value);
          }} />
          <Button type='submit'>join room</Button>
        </div>

      </form>

      <form className='flex flex-row' onSubmit={handleSubmit} >
        <div>
          <input type="text" placeholder='message' value={message} onChange={(e)=>{
            setMessage(e.target.value);
          }} />
          <Button type='submit'>send</Button>
        </div>
        <div>
          <input type="text" placeholder='individual id' value={room} onChange={(e)=>{
            setRoom(e.target.value);
          }} />
        </div>
      </form>
      <div>
          {
            chat.map((m,i) => (
              <p key={i}>{m}</p>
            ))
          }
        </div>
    </Container>
  )
}

export default App