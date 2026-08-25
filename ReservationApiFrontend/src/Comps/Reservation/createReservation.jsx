import React from "react";
export default function Create({onReservationSuccess,reservation}){
    const [newReservation,setNewReservation]=React.useState({
        userId:"",
        resourceId:"",
        startTime:"",
        endTime:"",
        status:""
    });
    const [isLoading,setIsLoading]=React.useState(false);
    const [submitting,setSubmitting]=React.useState(false);
    function inputHandler(use){
        const {name,value}=use.target;
        setNewReservation(prevs=>({
            ...prevs,
            [name]:value
        }))
    };
    async function handleNewReservation(use){
        use.preventDefault();

        if (!newReservation.resourceId || !newReservation.startTime || !newReservation.endTime || !newReservation.status){
            alert ("Please select a resource and provide start and end Time and Status");
            return;
        }
        setIsLoading(true);
        try{
            const token=localStorage.getItem("token");
            if (!token){
                throw new Error ("Authentication session is missing");
            }
            const response=await fetch(`http://localhost:5000/reservations/${newReservation.resourceId}`,{
                method:"POST",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    startTime:new Date(newReservation.startTime).toISOString(),
                    endTime: new Date(newReservation.endTime).toISOString(),
                    status: newReservation.status
                })
            });
            const data=await response.json();

            if (!response.ok){
                throw new Error(data.msg || data.message ||"Failed to book resources")
            }
            alert ("Reservation successfully created");
        
        setNewreservation({resourceId:"",startTime:"",endTime:""});

        if (onReservationSuccess){
            onReservationSuccess();
        }
    }
    catch(err){
        console.log(err);
        alert ("Something went wrong",error)
    }finally {
        setIsLoading(false);
    }
    }
    
    const minDateTime=new Date().toISOString().slice(0,16);
    return (
        <>
        <h4>Book a reservation slot</h4>
        <div className="st1">
        <div className="book">
            
            <form onSubmit={handleNewReservation}>
            <div className="book1">
                <label htmlFor="resourceId">Choose a Resource</label>
                <select 
                id="resourceId"
                name="resourceId"
                value={newReservation.resourceId}
                onChange={inputHandler}
                required
                disabled={isLoading}>
                    <option value=''>{isLoading ?"Loading Resources ...":"--Select a Resource--"}</option>
                {Array.isArray(reservation) && reservation.map((resources)=>(
                    <option key={resources._id}
                    value={resources._id} 
                    >
                        {resources.name} {resources.location ? `(${resources.location})`:""}
                    </option>
                ))}
                </select>
            </div>
            <div className="book1">
                <label htmlFor="startTime">
                    <input 
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    min={minDateTime}
                    onChange={inputHandler}
                    value={newReservation.startTime}
                    required />
                </label>
                <label htmlFor="endTime">
                    <input 
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    min={minDateTime || newReservation.startTime}
                    value={newReservation.endTime}
                    onChange={inputHandler}
                    required />
                </label>
                <label htmlFor="status">
                    <input 
                    type="text"
                    id="status"
                    name="status"
                    onChange={inputHandler}
                    placeholder="Pending/Confirmed/Cancelled"
                    style={{padding:"10px"}}
                    />
                </label>
                  </div>
                <button type="submit" class="btn"
                disabled={submitting || isLoading}>
                    {submitting ? "Processing Booking ...":"Confirm Reservation"}
                </button>
          
            </form>
        </div>
        </div>
        </>
    )
}