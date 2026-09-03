import React from "react";
import { Card, Col, Row, Button,Alert} from "react-bootstrap";

const GetReservation=React.forwardRef(({currentUser, reservation,setReservation},ref)=>{
    const [isDeleting,setIsDeleting]=React.useState(false);
    const [loading,setLoading]=React.useState(false);
    const [isApproving, setIsApproving] = React.useState(false);
    const [alertMessage,setAlertMessage]=React.useState({type:"",text:""})
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
                setAlertMessage({type:"danger",text:"No authentication token for the user"});
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
            setAlertMessage({type:"danger",text:err})
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
            
            setAlertMessage({type:"success",text:"Reservation approved and completed successfully!"});
            getRes(); // Reload the layout grid to pull live database changes
        } catch (err) {
            console.error(err);
            setAlertMessage({type:"danger",text:err.message || "Something went wrong during approval"});
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
            setAlertMessage({type:"success",text:data.msg || "Reservation successfully deleted"});
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
        {alertMessage.text && (
            <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: "", text: "" })} dismissible>
                {alertMessage.text}
            </Alert>
        )}
        <div>
            {reservation && reservation.length > 0 && (
                <div className="resourceManager4 container my-4">
                    <h3 className="mb-4" style={{ color: "black", fontWeight: 600 }}>List of Reservations</h3>
                    
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {reservation.map((item) => (
                            <Col key={item._id}>
                                <Card className="h-100 shadow-sm border-0 bg-white">
                                    <Card.Body className="d-flex flex-column justify-content-between p-3">
                                        
                                        <div>
                                            
                                            <Card.Title className="d-flex justify-content-between align-items-start
                                             mb-3 border-bottom pb-2">
                                                <span className="fw-bold text-dark fs-5">
                                                    {item.resourceId && typeof item.resourceId === "object" 
                                                        ? item.resourceId.name 
                                                        : "N/A"}
                                                </span>
                                            </Card.Title>
                                    
                                            <Card.Text className="text-secondary small mb-2">
                                                <strong>Type:</strong> {
                                                    item.resourceId && typeof item.resourceId === "object" 
                                                        ? item.resourceId.resourceType 
                                                        : "N/A"
                                                }
                                            </Card.Text>

                                            <Card.Text className="text-secondary small mb-2"> 
                                                <strong>Location:</strong> {
                                                    item.resourceId && typeof item.resourceId === "object" 
                                                        ? item.resourceId.location 
                                                        : "N/A"
                                                }
                                            </Card.Text>
                                
                                            <Card.Text className="text-secondary small mb-2">
                                                <strong>Status:</strong>{" "}
                                                <span className={`fw-bold ${item.status === 'Approved' ? 'text-success' : 'text-warning'}`}>
                                                    {item.status}
                                                </span>
                                            </Card.Text>
                                
                                            <Card.Text className="text-secondary small mb-2">
                                                <strong>Start Time:</strong> {item.startTime ? new Date(item.startTime).toLocaleString() : "N/A"}
                                            </Card.Text>
                                        
                                            <Card.Text className="text-secondary small mb-3">
                                                <strong>End Time:</strong> {item.endTime ? new Date(item.endTime).toLocaleString() : "N/A"}
                                            </Card.Text>
                                            
                                            {item.notes && (
                                                <Card.Text className="p-2 bg-light rounded small border-start border-primary">
                                                    <strong>User Note:</strong> {item.notes}
                                                </Card.Text>
                                            )}
                                        </div>

                                    
                                        <div className="d-grid gap-2 mt-3">
                                            {isAdmin && item.status === "Admin Request Pending" && (
                                                <Button 
                                                    type="button"
                                                    variant="success"
                                                    onClick={() => handleApproveRequest(item._id)}
                                                    disabled={isApproving}
                                                    className="fw-bold shadow-sm py-2"
                                                >
                                                    {isApproving ? "Approving..." : "Approve & Book Slot"}
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                type="button"
                                                variant="danger"
                                                onClick={() => handleDeleteReservation(item._id)}
                                                disabled={isDeleting}
                                                className="fw-bold shadow-sm py-2"
                                            >
                                                {isDeleting ? "Processing..." : "Cancel / Delete"}
                                            </Button>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
        
    </div>
);

});
export default GetReservation;