import { useState } from 'react'

import './App.css'
import Card from './components/card.jsx'

function App() {



  return (
    <>
      <h1 className='bg-green-400 text-black p-4 rounded-xl mb-4'>Mitali</h1>
      <Card name="mitali" btnText="click me" />
      <Card name="patel" btnText="visit more" />
      <Card name="prick" />
    </>
  )
}


export default App
