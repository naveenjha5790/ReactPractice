import { useState } from 'react';
import Body from './Comps/Body';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Body />
    </>
  )
}

export default App
