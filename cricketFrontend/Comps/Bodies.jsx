import React, { useState, useEffect } from "react"
import Post from "./Post";
import Get from "./Get";
import PatchDelete from "./PatchDelete";
export default function Bodies({ view, cricketer, setCricketer }) {
    return (
        <div style={{ marginTop: "20px",paddingTop:"30px" }}>
            {view === "add" && <Post setCricketer={setCricketer} />}
            {view === "show" && <Get cricketer={cricketer} setCricketer={setCricketer} />}
            {view === "update" && <PatchDelete cricketer={cricketer} setCricketer={setCricketer} />}
        </div>
    );
}
/*export default function Bodies({initialFormOpen, hideGrid}){
    const [cricketer, setCricketer] = useState([]);
   
       // const [isLoading, setIsLoading] = useState(false); 

       return (
    <>
    {(initialFormOpen || !hideGrid) && <Post setCricketer={setCricketer}/>}

    {hideGrid && <Get cricketer={cricketer} setCricketer={setCricketer}/>}
    {(initialFormOpen || !hideGrid) && <PatchDelete setCricketer={setCricketer} cricketer={cricketer} />}
    </>
)};*/
