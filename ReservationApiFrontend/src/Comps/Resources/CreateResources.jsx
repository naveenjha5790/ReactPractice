import React from "react";
import { Button, Col, Container, Form ,Alert} from "react-bootstrap";
export default function CreateResource({currentUser,resource,setResource}){
    const [newResource,setNewResource]=React.useState({
            name:"",
            resourceType:"Room",
            capacity:1,
            location:"",
            pricePerUnit:0,
            pricingType:"Hourly"
    
        });
        const [alertMessage,setAlertMessage]=React.useState({type:"",text:""});
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
                
               setAlertMessage({type:"success",text:"Resource created successfully"});
                setNewResource({name:"",resourceType:"room",
                    location:"",
                    capacity:1,
                    pricePerUnit:0,
                    pricingType:"Hourly",
    
                });
                
            }catch(err){
                console.log(err);
                setAlertMessage({type:"danger",text:err.message});
            }finally{
                setSubmitting(false);
            }
        }
        console.log("CRITICAL AUTH CHECK - currentUser details:", currentUser);
        const isAdmin=currentUser?.role?.toLowerCase()==="admin";
        return (
            <>
           
            {isAdmin && (
                <div className="bg-success text-white p-3 mt-4 rounded">
                    <h4 style={{color:"floralwhite"}}>Add new Resource</h4>
                    <Form onSubmit={inputHandler} className="mb-3">
                        <Form.Group className="mb-1">
                        <div>
                            <Form.Label>Resource Name: </Form.Label>
                           <Form.Control type="text" name="name"
                            value={newResource.name}
                            onChange={handleChange} 
                            className="mb-1"
                            required>
                            </Form.Control>

                        </div>
                        <div>
                            <Form.Label>Resource Type:</Form.Label>
                            <Form.Select name="resourceType"
                            value={newResource.resourceType}
                            onChange={handleChange} 
                            required>
                                <option value="Room">Room</option>
                    <option value="Hall">Hall</option>
                     <option value="Slots">Slots</option>
                    <option value="Equipment">Equipment</option>
                            </Form.Select>
                        </div>
                        <div>
                            <Form.Label>Capacity:(People/Units)</Form.Label>
                            <Form.Control type="number" name="capacity" className="mb-1"
                            value={newResource.capacity} onChange={handleChange} >
                            </Form.Control>
                        </div>
                        <div>
                            <Form.Label>Location</Form.Label>
                            < Form.Control type="text" name="location" className="mb-1"
                            value={newResource.location} onChange={handleChange}>
                            </Form.Control>

                        </div>
                        <div>
                            <Form.Label>Price Per Unit (₹):</Form.Label>
              <Form.Control type="number" name="pricePerUnit" min="0" value={newResource.pricePerUnit} onChange={handleChange}
              className="mb-1">
              </Form.Control>
                        </div>
                        <div>
                            <Form.Label>Pricing Type Strategy:</Form.Label>
              <Form.Select name="pricingType" value={newResource.pricingType} onChange={handleChange} className="mb-1" >
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Fixed">Fixed</option>
              </Form.Select>
                        </div>
                        <Button type="submit" disabled={submitting} variant="outline-light"
                        >
                            {submitting ? "Saving to database...":"Save Resource Item"}
                        </Button>
                        </Form.Group>
                    </Form>
                    {alertMessage.text && (
                        <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: "", text: "" })} dismissible>
                            {alertMessage.text}
                        </Alert>
                    )}
            </div>
           
            )}
           
            
            </>
        )
}