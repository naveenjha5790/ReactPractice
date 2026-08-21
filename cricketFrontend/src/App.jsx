import { useState } from 'react'
import Header from '../Comps/Header';
import Bodies from '../Comps/Bodies';
function App() {
  const [count, setCount] = useState(0)
  const [curView,setCurView]=useState("menu");
  const [cricketer, setCricketer] = useState([]);
  return (
    <>
     <Header />
    <main className='container'>
      {curView === "menu" && (
          <div className='frontMenu'>
            <div className='frontMenu1'>
              <button className='btn' onClick={() => setCurView("show")}>Show cricketers</button>
              <button className='btn' onClick={() => setCurView("add")}>Add Cricketers</button>
              <button className='btn' onClick={() => setCurView("update")}>Update Stats of cricketers</button>
            </div>
          </div>
        )}

        {curView !== "menu" && (
          <div>
            <button className='btnBack' onClick={() => setCurView("menu")}>⬅️ Back to Main Menu</button>
            
            {/* 🔑 FIX: Pass cricketer and setCricketer down into Bodies */}
            <Bodies 
              view={curView} 
              cricketer={cricketer} 
              setCricketer={setCricketer} 
            />
          </div>
        )}
        </main>
   
      
    </>
  )
}

export default App
