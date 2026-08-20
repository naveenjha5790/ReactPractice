import React, { useState, useEffect } from "react"
import Post from "./Post";
import Get from "./Get";
export default function Bodies({initialFormOpen, hideGrid}){
    const [cricketer, setCricketer] = useState([]);
   
       // const [isLoading, setIsLoading] = useState(false); 

       return (
    <>
    {(initialFormOpen || !hideGrid) && <Post setCricketer={setCricketer}/>}

    {hideGrid && <Get cricketer={cricketer} setCricketer={setCricketer}/>}
        
    </>
)};
