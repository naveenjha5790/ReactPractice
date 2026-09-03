import React from "react";
import { Form,Button, Row ,Col,Alert} from "react-bootstrap";
export default function Create({onReservationSuccess,reservation,currentUser}){
     const isAdmin = currentUser?.role?.toLowerCase() === "admin";
    const [isAdminRequest, setIsAdminRequest] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState({ type: "", text: "" });
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
             setAlertMessage({ type: "danger", text: "Please select a resource and provide dates!" });
            return;
        }
        const isAdmin = currentUser?.role?.toLowerCase() === "admin";

        if (isAdmin && !newReservation.userId.trim()) {
        setAlertMessage({type:"primary",text:"As an administrator, you must specify a target User ID to book on their behalf."});
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
                    console.log("THE ACTUAL BACKEND API RESPONSE DATA OBJECT IS:", data);
            if (!response.ok){
                throw new Error(data.msg || data.message ||"Failed to book resources")
            }
            setAlertMessage({ type: "success", text: "Reservation successfully created!" });
        
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
      setAlertMessage({ type: "danger", text: err.message || "Something went wrong" });
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
        <div className="text-white p-3 mt-4 rounded justify-content-center bg-primary">
            <Form onSubmit={handleNewReservation} className="mb-2">
            <Form.Group className="mb-1">
                <Form.Label htmlFor="resourceId" 
                className="fw-bold">Book a reservation slot
                </Form.Label>
                <Form.Select
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
                </Form.Select>
            </Form.Group>
            <Row className="mb-3">
                <Col sm={12} md={6}>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="startTime"
                className="fw-bold">Start Time</Form.Label>
                    <Form.Control
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    min={minDateTime}
                    onChange={inputHandler}
                    value={newReservation.startTime}
                    required />
                
                </Form.Group>
                </Col>

                <Col sm={12} md={6}>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="endTime">End Time</Form.Label>
                    <Form.Control
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    min={minDateTime || newReservation.startTime}
                    value={newReservation.endTime}
                    onChange={inputHandler}
                    required />
                
                </Form.Group>
                </Col>
                </Row>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="status">Status setting</Form.Label>
                    <Form.Select
                id="status"
                name="status"
                value={newReservation.status}
                onChange={inputHandler}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
              </Form.Group>
            
              <div>
                <Form.Group className="mb-3">
             
                <Form.Check
                className="w-20 text-light"
                  type="checkbox"
                  checked={isAdminRequest}
                  label="Can't book yourself? Send request to Admin instead"
                  onChange={(e) => setIsAdminRequest(e.target.checked)}
                />
                </Form.Group>
                

                {isAdminRequest && (
                    <Form.Group className="mb-3 p-3 bg-light rounded text-dark">
                    <Form.Label className="text-primary small fw-bold">Reason for Escalation:</Form.Label>
                  <Form.Control
                  as="textarea"
                  rows={3}
                    name="notes"
                    className="text-black"
                    placeholder="Provide details for why you are escalating this slot reservation request..."
                    value={newReservation.notes || ""}
                    onChange={inputHandler}
                    required
                  />
                  </Form.Group>
                )}
                </div>
                  
                <Button type="submit" 
                className="w-100 fw-bold mt-2 shadow-sm py-2"
                disabled={submitting || isLoading}>
                    {submitting ? "Processing Booking ...":"Confirm Reservation"}
                </Button>
            </Form>
            {alertMessage.text && (
    <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: "", text: "" })} dismissible>
        {alertMessage.text}
    </Alert>
)}
        </div>
        </>
    )
}