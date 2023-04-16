import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const sendPDF=async()=>{
    const response=await axios.post('http://localhost:3000/send', {
      email: 'you@gmail.com',
      name: 'Faizan Ahmed',
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response.data)
  }

  return (
    <div className="App">
     <button onClick={sendPDF}>Send PDF</button>
    </div>
  )
}

export default App
