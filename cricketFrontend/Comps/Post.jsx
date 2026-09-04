import React, { useState, useEffect } from "react"
export default function Post({setCricketer}){
    const [newCricketer, setNewCricketer] = useState({
            name:"",
            country:"",
            tests:"",
            highestScore:"",
            wickets:"",
            batAvg:"",
            bowlAvg:"",
            runs:""
        }); 
        const [isLoading, setIsLoading] = useState(false); 
        
        function postHandler(cri){
        const {name,value}=cri.target;
        setNewCricketer(prev=>({
            ...prev,[name]:value
        }))
    };
    async function handleNewCricketer(crs){
        crs.preventDefault();
        if (!newCricketer.name || !newCricketer.country){
            alert("Name and country are compulsory");
            return;
        }
        setIsLoading(true)
        try{
            const payload={
                name:newCricketer.name,
                country:newCricketer.country,
                runs: newCricketer.runs || 0,
                batAvg: newCricketer.batAvg || 0,
                wickets: newCricketer.wickets || 0,
                highestScore: newCricketer.highestScore || 0,
                bowlAvg: newCricketer.bowlAvg || 0,
                tests: newCricketer.tests || 0
            };
            const response=await fetch("http://localhost:5000/",{
                method:"POST",
                headers:{"content-Type":"application/json"},
                body:JSON.stringify(payload)
            })
            const data=await response.json();
            console.log("crciketers created successfully");
            const newPlayer= data.task || data.cricketer || data;
            setCricketer(prevs=>[newPlayer,...prevs])

            setNewCricketer({
                name:"",country:"",runs:"",highestScore:"",
                batAvg:"",bowlAvg:"",tests:""
            });
            alert(`${payload.name} added to the dashboard!`)
        }catch (err){
            console.log("POST request failed",err);
        }finally{
            setIsLoading(false);
        }
    }
return (
<div className="container mt-4">
            <h3 className="text-bold text-center text-info mb-4">Add new Cricketer</h3>
            <form onSubmit={handleNewCricketer}>
                
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    <div className="col mb-2">
                    <input type="text" name="name" placeholder="Full Name" value={newCricketer.name} onChange={postHandler} className="form-control"/>
                </div><div className="col mb-2">
                   <input type="text" name="country" placeholder="Country" value={newCricketer.country} onChange={postHandler} className="form-control" />
                </div><div className="col mb-2">
                    <input type="number" name="tests" placeholder="Tests played" value={newCricketer.tests} onChange={postHandler} className="form-control" />
                </div><div className="col mb-2">
                    <input type="number" name="runs" placeholder="Runs scored" value={newCricketer.runs} onChange={postHandler} className="form-control" />
                </div><div className="col mb-2">
                    <input type="number" name="batAvg" placeholder="Batting Average" value={newCricketer.batAvg} onChange={postHandler} className="form-control" />
               </div>
                <div className="col mb-2">
                    <input type="number" name="wickets" placeholder="Wickets Taken" value={newCricketer.wickets} onChange={postHandler} className="form-control" />
                </div>
                <div className="col mb-2">
                    <input type="number" name="highestScore" placeholder="Highest Score" value={newCricketer.highestScore} onChange={postHandler} className="form-control" />
                </div>
                <div className="col mb-2">
                   <input type="number" name="bowlAvg" placeholder="Bowling Average" value={newCricketer.bowlAvg} onChange={postHandler} className="form-control"/> 
                   </div></div>
                <button type="submit" className="btn btn-success btn-align-items-center">{isLoading ? "Saving Entry" : "Create Cricketers profile"}</button>
            </form>
        </div>
)
}
