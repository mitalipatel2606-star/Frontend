import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  const [counter, setCounter] = useState(5)
  //let counter = 5;
  const addValue = () => {
    console.log("value added ", counter);
    if (counter < 25)
      setCounter(counter + 1)
  }
  const removeValue = () => {
    if (counter > 0)
      setCounter(counter - 1)
  }

  return (
    <>
      <h1>Hello Mitali</h1>
      <h2>Counter Value:{counter}</h2>
      <button
        onClick={addValue}>Increase Counter:{counter}</button>
      <button
        onClick={removeValue}>Decrease Counter:{counter}</button>
      <p>footer:{counter}</p>
    </>
  )
}

export default App
