import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  let counter = 5;
  const addValue = () => {
    console.log("value added ", counter);
    counter = counter + 1;
  }

  return (
    <>
      <h1>Hello Mitali</h1>
      <h2>Counter Value:{counter}</h2>
      <button
        onClick={addValue}>Increase Counter:{counter}</button>
      <button>Decrease Counter:{counter}</button>
      <p>footer:{counter}</p>
    </>
  )
}

export default App
