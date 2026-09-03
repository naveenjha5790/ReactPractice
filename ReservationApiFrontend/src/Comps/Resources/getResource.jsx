import React, { useState } from "react";
import { Card, Col, Row,Button, Badge,Alert} from "react-bootstrap";
export default function GetResource({currentUser,resource,setResource}){
    const [loading,setLoading]=React.useState(false);
    const [selectedResource,setSelectedResource]=React.useState(null);
    const [alertMessage,setAlertMessage]=React.useState({type:"",text:""})
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
            setAlertMessage({type:"danger",text:"Something went wrong in loading resources"})
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

        setAlertMessage({type:"primary",text:specificationsMessage});
                if (!response.ok) throw new Error("Failed to load the resource or the resource doesn't exist");
                setSelectedResource(data.resource);
            }
            catch(err){
                console.log(err);
                setAlertMessage({type:"danger",text:"SOMETHING WENT WRON IN GETTING THAT RESOURCE"||err});
            
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
                <Row xs={1} md={3}>
                    {resource.map((item)=>(
                        <Col key={item._id}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="d-flex justify-content-between"><Card.Title className="d-flex flex-column-row justify-content-between align-items-center mb-3 p-2">
                                    <span className="fw-bold-text-dark">{item.name}</span>
                                     {!item.isActive && (<Badge bg="danger">Inactive</Badge>)}</Card.Title>
                        <Card.Text className="text-secondary small mb-3">
                           <span className="d-block mb-1"> Type:{item.resourceType} </span>
                          <span className="d-block mb-1"> Capacity: {item.capacity}</span>
                    <span className="d-block mb-1">Rate: ₹{item.pricePerUnit}/{item.pricingType}</span>
                        
                   <span className="d-block mb-1">Located at:{item.location}</span>
                   </Card.Text>
                        
                        
                        {isAdmin && (
                            <Button variant="secondary" onClick={()=> viewSingleResource(item._id)} className="w-10 h-30 mt-3 fw-bold shadow-sm"
                            size="sm"
                            >View Detailed Admin Log</Button>
                        )}
                        </Card.Body>
                        </Card>
                       </Col>

                    ))}
            
            </Row>
            )}
            
            </div>
            {alertMessage.text && (
                <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: "", text: "" })} dismissible>
                    {alertMessage.text}
                </Alert>
            )}
            </div>

        
    
)
}