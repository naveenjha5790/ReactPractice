import React from "react";
export default function CreateResource({currentUser,resource,setResource}){
    const [newResource,setNewResource]=React.useState({
            name:"",
            resourceType:"Room",
            capacity:1,
            location:"",
            pricePerUnit:0,
            pricingType:"Hourly"
    
        });
        const [submitting,setSubmitting]=React.useState(false);
    function handleChange(e) {
            const { name, value } = e.target;
            setNewResource((prev) => ({
                ...prev,
                [name]: name === "capacity" || name === "pricePerUnit" ? Number(value) : value
            }));
        }
            async function inputHandler(reso){
                reso.preventDefault();
                setSubmitting(true);
                try{
                    const token=localStorage.getItem("token");
                    const response=await fetch("http://localhost:5000/resources",{
                        method:"POST",
                        headers:{
                            "content-Type":"application/json",
                            "Authorization":`Bearer ${token}`
                        },
                        body:JSON.stringify(newResource)
                    });
                    const data=await response.json();
    
                    if (!response.ok) throw new Error("Failed to create a new resource");
                
                alert("Resource created successfully");
                setNewResource({name:"",resourceType:"room",
                    location:"",
                    capacity:1,
                    pricePerUnit:0,
                    pricingType:"Hourly",
    
                });
                
            }catch(err){
                console.log(err);
                alert(err.message);
            }finally{
                setSubmitting(false);
            }
        }
        console.log("CRITICAL AUTH CHECK - currentUser details:", currentUser);
        const isAdmin=currentUser?.role?.toLowerCase()==="admin";
        return (
            <>
            <div className="rest">
            {isAdmin && (
                
                <div className="resourceManager4">
                    <h4>Add new Resource</h4>
                    <form onSubmit={inputHandler}>
                        <div>
                            <label>Resource Name: </label>
                            <input type="text" name="name"
                            value={newResource.name}
                            onChange={handleChange} 
                            required />

                        </div>
                        <div>
                            <label>Resource Type:</label>
                            <select name="resourceType"
                            value={newResource.resourceType}
                            onChange={handleChange} 
                            required>
                                <option value="Room">Room</option>
                    <option value="Hall">Hall</option>
                     <option value="Slots">Slots</option>
                    <option value="Equipment">Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label>Capacity:(People/Units)</label>
                            <input type="number" name="capacity"
                            value={newResource.capacity} onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label>Location</label>
                            <input type="text" name="location"
                            value={newResource.location} onChange={handleChange} 
                            />

                        </div>
                        <div>
                            <label>Price Per Unit (₹):</label>
              <input type="number" name="pricePerUnit" min="0" value={newResource.pricePerUnit} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Pricing Type Strategy:</label>
              <select name="pricingType" value={newResource.pricingType} onChange={handleChange}  >
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Fixed">Fixed</option>
              </select>
                        </div>
                        <button type="submit" disabled={submitting} className="rest1">
                            {submitting ? "Saving to database...":"Save Resource Item"}
                        </button>
                    </form>
            </div>
           
            )}
             </div>
            
            </>
        )
}