import React from "react";
export default function Create({onReservationSuccess,reservation,currentUser}){
     const isAdmin = currentUser?.role?.toLowerCase() === "admin";
    const [isAdminRequest, setIsAdminRequest] = React.useState(false);
     const [newReservation,setNewReservation]=React.useState({
        userId:"",
        resourceId:"",
        startTime:"",
        endTime:"",
        status:"Confirmed",
        onBehalfofUser:""
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
        const isAdmin = currentUser?.role?.toLowerCase() === "admin";

        if (isAdmin && !newReservation.userId.trim()) {
        alert("As an administrator, you must specify a target User ID to book on their behalf.");
        return;
    }
        setIsLoading(true);
        try{
            const token=localStorage.getItem("token");
            if (!token){
                throw new Error ("Authentication session is missing");
            }
            const requestBody = {
            startTime: new Date(newReservation.startTime).toISOString(),
            endTime: new Date(newReservation.endTime).toISOString(),
            status: isAdminRequest ? "Admin Request Pending" : newReservation.status,
            notes: newReservation.notes
        };
        if (isAdmin) {
            requestBody.userId = newReservation.userId;
        }
            const response=await fetch(`http://localhost:5000/reservations/${newReservation.resourceId}`,{
                method:"POST",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify(requestBody)});
            const data=await response.json();

            if (!response.ok){
                throw new Error(data.msg || data.message ||"Failed to book resources")
            }
            alert ("Reservation successfully created");
        
        setNewReservation({userId:"",resourceId:"",startTime:"",endTime:""
            ,status:"Confirmed",notes:""
        });
                setIsAdminRequest(false);
        if (onReservationSuccess){
            onReservationSuccess();
        }
    }
    catch(err){
        console.log(err);
        alert ("Something went wrong")
    }finally {
        setIsLoading(false);
    }
    }
    
    const minDateTime=new Date().toISOString().slice(0,16);
    if (isAdmin) {
    return (
      <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", color: "#6c757d", textAlign: "center" }}>
         <p>Administrators manage existing configurations and approve user help requests from the tracking panel below.</p>
      </div>
    );
  }
    return (
        <>
        <div className="st1">
        <div className="book">
            <form onSubmit={handleNewReservation}>
            
            
            <div className="book1">
                <label htmlFor="resourceId">Book a reservation slot</label>
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
                <label htmlFor="status">Status setting</label>
                    <select
                id="status"
                name="status"
                value={newReservation.status}
                onChange={inputHandler}
                style={{ padding: "10px", width: "100%" }}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
                  </div>
            
              <div style={{ backgroundColor: "#e2f0fe", padding: "10px", borderRadius: "4px", margin: "15px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#004085" }}>
                <input
                  type="checkbox"
                  checked={isAdminRequest}
                  onChange={(e) => setIsAdminRequest(e.target.checked)}
                />
                Can't book yourself? Send request to Admin instead
              </label>

                {isAdminRequest && (
                  <textarea
                    name="notes"
                    placeholder="Provide details for why you are escalating this slot reservation request..."
                    value={newReservation.notes || ""}
                    onChange={inputHandler}
                    style={{ width: "100%", marginTop: "8px", padding: "5px", boxSizing: "border-box" }}
                    required
                  />
                )}
                </div>
                  
                <button type="submit" className="btn"
                disabled={submitting || isLoading}>
                    {submitting ? "Processing Booking ...":"Confirm Reservation"}
                </button>
          
            </form>
        </div>
        </div>
        </>
    )
}