import React from "react";

const GetReservation=React.forwardRef(({currentUser, reservation,setReservation},ref)=>{
    const [isDeleting,setIsDeleting]=React.useState(false);
    const [loading,setLoading]=React.useState(false);
    const [isApproving, setIsApproving] = React.useState(false);
    const [details,setDetails]=React.useState(false);
    const [newReservation,setNewReservation]=React.useState({
            resourceId:"",
            startTime:"",
            endTime:"",
            status:""
        });
        const [isLoading,setIsLoading]=React.useState(false);
        const isAdmin = currentUser?.role?.toLowerCase() === "admin";
    /*function inputHandler(use){
        const {name,value}=use.target;
        setReservation(prevs=>({
            ...prevs,
            [name]:value
        }))
    };*/
    async function getRes(){
        setLoading(true);
        try{
            const token=localStorage.getItem("token");
            if (!token){
                alert("No authentication token for the user");
                return;
            }

            const response=await fetch("http://localhost:5000/reservations",{
                method:"GET",
                    headers:{
                        "content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                
            });
            const data=await response.json();
            setReservation(data.reservation || []);
        }
        catch(err){
            console.log(err);
            alert (err);
        }finally {
            setLoading(false);
        }
    }
    async function handleApproveRequest(reservationId) {
        if (!window.confirm("Do you want to confirm and book this slot on behalf of the user?")) {
            return;
        }
        setIsApproving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/reservations/${reservationId}/approve`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update reservation status");
            }
            
            alert("Reservation approved and completed successfully!");
            getRes(); // Reload the layout grid to pull live database changes
        } catch (err) {
            console.error(err);
            alert(err.message || "Something went wrong during approval");
        } finally {
            setIsApproving(false);
        }
    }
    React.useImperativeHandle(ref, () => ({
        getRes
    }));
    React.useEffect(()=>{
        getRes();
    },[currentUser]
    );
    function td(){
        setDetails(prevs=>!prevs);
    }
    async function handleDeleteReservation(reservationId){
        if (!window.confirm("Are you sure want to delete this ")){
            return;
        }
        setIsDeleting(true)
        try{
            const token=localStorage.getItem("token");
            const response=await fetch(`http://localhost:5000/reservations/${reservationId}`,{
                method:"DELETE",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            });
            const data= await response.json();
            if (!response.ok){
                throw new Error(data.message || "failed to complete deletion")
            }
            alert (data.msg || "Reservation successfully deleted");
            setReservation((prevs)=>
            prevs.filter((item)=> item._id !== reservationId));
        }catch(err){
            console.log(err);
        }finally{
            setIsDeleting(false);
        }
    }
    
    
    return (
        <div>
          {loading && <p style={{ textAlign: "center" }}>Loading reservations...</p>}  
        
        <div>
        {reservation && reservation.length >0 && (
        <>
        <div className="resourceManager4">
            <h3 style={{color:"black",fontWeight:600}}>List of Reservations</h3>
        {reservation.map((item) => (
           
    <div className="ss3" key={item._id}>
         <div className="ss1">
       <p>
            <strong>Resource Name:</strong> {
                item.resourceId && typeof item.resourceId === "object" 
                    ? item.resourceId.name 
                    : "N/A"
            }
        </p><p>
            <strong>Type:</strong> {
                item.resourceId && typeof item.resourceId === "object" 
                    ? item.resourceId.resourceType 
                    : "N/A"
            }
        </p>

        <p>
            <strong>Location:</strong> {
                item.resourceId && typeof item.resourceId === "object" 
                    ? item.resourceId.location 
                    : "N/A"
            }
        </p>
        <p><strong>Status:</strong> {item.status}</p>
        <p>
                    <strong>Start Time:</strong> {item.startTime ? new Date(item.startTime).toLocaleString() : "N/A"}
                </p>
                <p>
                    <strong>End Time:</strong> {item.endTime ? new Date(item.endTime).toLocaleString() : "N/A"}
                </p>
                
                    {item.notes && (
                        <p>
                            <strong>User Note:</strong> {item.notes}
                                        </p>
                            
                    )}
                
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                   
                                    {isAdmin && item.status === "Admin Request Pending" && (
                                        <button 
                                            type="button"
                                            onClick={() => handleApproveRequest(item._id)}
                                            disabled={isApproving}
                                            style={{ backgroundColor: "#16a34a", color: "white", cursor: "pointer", fontSize: "14px", padding: "10px", margin: "5px" }}
                                        >
                                            {isApproving ? "Approving..." : "Approve & Book Slot"}
                                        </button>
                                    )}
                                    </div>
        <button 
            type="button"
            onClick={() => handleDeleteReservation(item._id)}
            disabled={isDeleting}
            style={{ backgroundColor: "#dc2626", color: "white", cursor: "pointer",fontSize:"14px",padding:"10px"
                ,margin:"5px"
            }}
        >
            {isDeleting ? "Processing..." : "Cancel/Delete Reservation"}
        </button>
    </div>
))}
</div>

    
       </> )}
        </div>
        </div>
    )
});
export default GetReservation;