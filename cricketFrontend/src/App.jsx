import { useState } from 'react'
import Header from '../Comps/Header';
import Body from './Body';
import Bodies from '../Comps/Bodies';
function App() {
  const [count, setCount] = useState(0)
  const [curView,setCurView]=useState("menu");

  return (
    <>
     <Header />
    <main className='container'>
      {curView==="menu" && (
        <div className='frontMenu'>
          
          <div className='frontMenu1'>
            <button className='btn'
            onClick={()=> setCurView("show")}>
              Show cricketers
            </button>
            <button className='btn'
            onClick={()=>setCurView("add")}>
              Add Cricketers
            </button>
          </div>
        </div>)}
        {curView==="add" && (
          <div>
            <button className='btnBack'
            onClick={()=> setCurView("menu")}
            >⬅️ Back to Main Menu</button>
            <Bodies initialFormOpen={false} />
          </div>
        )}
        {curView==="show" && (
          <div>
            <button className='btnBack'
            onClick={()=> setCurView("menu")}
            >⬅️ Back to Main Menu</button>
            <Bodies initialFormOpen={false} 
            hideGrid={true} />
          </div>
        )}
        </main>
   
      
    </>
  )
}

export default App
