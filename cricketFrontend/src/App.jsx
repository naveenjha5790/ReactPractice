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
    <main>
      {curView === "menu" && (
          <div className='container-lg container-text-center'>
           
              <button className='btn btn-success rounded btn-lg mb-3 mt-5' onClick={() => setCurView("show")}>Show cricketers</button>
              <button className='btn btn-danger rounded btn-lg mb-3' onClick={() => setCurView("add")}>Add Cricketers</button>
              <button className='btn btn-info rounded btn-lg mb-3' onClick={() => setCurView("update")}>Update Stats of cricketers</button>
            </div>
        )}

        {curView !== "menu" && (
          <div>
            
            <button className='btn btn-warning btn-sm' onClick={() => setCurView("menu")}>⬅️ Back to Main Menu</button>
            
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
