import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import { Button } from '@/components/ui/button'
import Btn from '@/components/Btn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-test-100'>test</div>
      <Button className='text-xl'>test</Button>
      <Btn />
    </>
  )
}

export default App
