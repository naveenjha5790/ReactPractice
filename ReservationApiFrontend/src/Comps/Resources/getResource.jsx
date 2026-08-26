import React, { useState } from "react";
export default function GetResource({currentUser,resource,setResource}){
    const [loading,setLoading]=React.useState(false);
    const [selectedResource,setSelectedResource]=React.useState(null);
    const [newResource,setNewResource]=React.useState({
        name:"",
        resourceType:"Room",
        capacity:1,
        location:"",
        pricePerUnit:0,
        pricingType:"Hourly"

    });
    const [submitting,setSubmitting]=React.useState(false);
    async function fetchAllResource(){
         setLoading(true);
        try{
            const token=localStorage.getItem("token");
            const response=await fetch("http://localhost:5000/resources",{
                method:"GET",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to load resources");
            const data=await response.json();
            setResource(data.resource || []);
        }
        catch(err){
            console.log(err);
            alert("Something went wrong in loading resources")
        }finally{
            setLoading(false);
        }
    }
        async function viewSingleResource(id){
            try{
                const token=localStorage.getItem("token");
                const response=await fetch(`http://localhost:5000/resources/${id}`,{
                    method:"GET",
                    headers:{
                        "content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                });
                const data=await response.json();
                const res=data.resource;
                const specificationsMessage = `
                --- DETAILED SPECIFICATIONS ---
                DB Index Key: ${res._id}
                Created By User ID: ${res.createdBy}
                Created Timestamp: ${new Date(res.createdAt).toLocaleString()}
                `.trim();

        // 2. Alert the data string directly to the user's screen
        alert(specificationsMessage);
                if (!response.ok) throw new Error("Failed to load the resource or the resource doesn't exist");
                setSelectedResource(data.resource);
            }
            catch(err){
                console.log(err);
                alert("sOMETHING WENT WRON IN GETTING THAT RESOURCE",err);
            
            }
        }
    React.useEffect(()=>{
        fetchAllResource();
    },[currentUser]
    )
    const isAdmin=currentUser?.role?.toLowerCase()==="admin";

return(

    <div className="resourceManager">
        <div className="resourceManager1">
            <h3 className="h33">Avaialble resources ({resource.length})</h3>
            {loading ? (
                <p>Loading items...</p>
            ):resource.length===0?(
                <p>No resources found.</p>
            ):(
                <div className="resourceManager2">
                    {resource.map((item)=>(
                        <div className="resourceManager5" key={item._id}>
                            <div className="rs5"><h5>{item.name} {!item.isActive && <span>(Inactive)</span>}</h5>
                        <p>
                            Type:{item.resourceType} <p/>
                            <p>Capacity: {item.capacity}</p>
                        <p>Rate: ₹{item.pricePerUnit}/{item.pricingType}</p>
                        </p>
                        <p>Located at:{item.location}</p></div>
                        {isAdmin && (
                            <button onClick={()=> viewSingleResource(item._id)} style={{backgroundColor:"darkgray",color:"floralwhite",fontWeight:700
                            }}>View Detailed Admin Log</button>
                        )}
                        </div>

                    ))}
            
            </div>
            )}
            
            </div>
            
            </div>

        
    
)
}