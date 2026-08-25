import React from "react";

const GetReservation=React.forwardRef(({currentUser, reservation,setReservation},ref)=>{
    
    const [loading,setLoading]=React.useState(false);
    const [details,setDetails]=React.useState(false);
    const [newReservation,setNewReservation]=React.useState({
            resourceId:"",
            startTime:"",
            endTime:"",
            status:""
        });
        const [isLoading,setIsLoading]=React.useState(false);
        
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
                alert("No authentication token for the user")
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
    
    
    return (
        <>
        <div className="getRes">
            <button className="getRes1" onClick={td}>
                {loading ?"hide":details ?"hide all":"show Reservation"}
            </button>
            {details && (
                <div className="reservations-list-container" style={{ marginTop: "20px" }}>
                    <h4>Reservations Breakdown ({reservation.length} found)</h4>
                    {reservation.length === 0 ? (
                        <p>No active reservations available.</p>
                    ) : (
                        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
    <tr>
        <th>Resource Name</th>
        <th>Type</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Status</th>
    </tr>
</thead>
<tbody>
    {reservation.map((res) => (
        <tr key={res._id}>
            <td>{res.resourceId?.name || "N/A"}</td>
            <td>{res.resourceId?.resourceType || "N/A"}</td>
            {/* Format the ISO date strings into a readable local clock style */}
            <td>{res.startTime ? new Date(res.startTime).toLocaleString() : "N/A"}</td>
            <td>{res.endTime ? new Date(res.endTime).toLocaleString() : "N/A"}</td>
            <td>
                <span className={`status-badge ${res.status}`}>
                    {res.status || "Pending"}
                </span>
            </td>
        </tr>
    ))}
</tbody>
                        </table>
                    )}
                </div>
            )}
        
        </div>
        
        </>
    )
});
export default GetReservation;