
import React from "react";
import { Form, Button,Alert} from "react-bootstrap";
export default function UpdateDeleteResources({currentUser,resource,setResource}){
    const [selectId,setSelectId]=React.useState("");
    const [isLoading,setIsLoading]=React.useState(false);
    const [alertMessage,setAlertMessage]=React.useState({type:"",text:""})
    const [isDeleting,setIsDeleting]=React.useState(false);
    const [updateRes,setUpdateRes]=React.useState({
        name:resource?.name ||"",
            resourceType:resource?.resourceType || "Room",
            capacity:resource?.capacity || 1,
            location:resource?.location || "",
            pricePerUnit:resource?.pricePerUnit || 0,
            pricingType:resource?.pricingType || "Hourly"
    })
    const [isSubmit,setIsSubmit]=React.useState(false);
    async function fetchInitialResource(){
        if (!resource || resource.length===0){
         setIsLoading(true);
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
            const resArray=Array.isArray(data.resource) ? data.resource :(data.resources || []);
            setResource(resArray);
        }
        catch(err){
            console.log(err);
            setAlertMessage({type:"danger",text:"Something went wrong in loading resources"})
        }finally{
            setIsLoading(false);
        }
    }
    }
    React.useEffect(()=>{
        fetchInitialResource()
    },[setResource])

    function handleResourceSelect(cd){
        const id=cd.target.value;
        setSelectId(id);
        const foundResource=resource.find(r=> r._id===id);
        if (foundResource){
            setUpdateRes({
                name:foundResource.name ||"",
            resourceType:foundResource.resourceType || "Room",
            capacity:foundResource.capacity || 1,
            location:foundResource.location || "",
            pricePerUnit:foundResource.pricePerUnit || 0,
            pricingType:foundResource.pricingType || "Hourly"
            })
        }
    }
    function handleInput(res){
        const {name,value}=res.target;
        const resValue=res.target.type==="number"?Number(value):value;
        setUpdateRes(prevs=>({
            ...prevs,
            [name]:resValue
        }))
    };
    async function handleUpdation(res){
        res.preventDefault();
        if (!selectId){
            setAlertMessage({type:"warning",text:"Please select a resource to update"});
        }
        setIsSubmit(true)
        try{
            const token=localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/resources/${selectId}`,{
                method:"PATCH",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify(updateRes)
                 })
                if (!response.ok){
                    throw new Error("Failed to update resources")
                }
                const data=await response.json();
                setResource(prevs=>
                    Array.isArray(prevs)?prevs.map(item=> (item._id=== selectId ? {...item,...updateRes}:item)):[]
                )
               setAlertMessage({type:"success",text:`Data of ${updateRes.name} has been updated`})

           
        }
        catch(err){
            console.log(err)
            setAlertMessage({type:"danger",text:err.message})
        }finally{
            setIsSubmit(false)
        }
    }
    async function handleDeleteResources(){
        if (!selectId) return;
        const confirmDelete=window.confirm(`Are you sure want to
            delete ${updateRes.name}`)
            if (!confirmDelete) return;
            setIsDeleting(true);
            try{
                const token=localStorage.getItem("token");
                const response=await fetch(`http://localhost:5000/resources/${selectId}`,{
                        method:"DELETE",
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                });
                if (!response.ok){
                    const ed=await response.json();
                    throw new Error(ed.msg || "Failed to Delete Resources")
                }
                setResource(prevs=>prevs.filter(item=>item._id !=selectId ))
                setAlertMessage ({type:"success",text:`${updateRes.name} Resource has been removed`});
                setSelectId("");
            }catch (err){
                console.log(err)
                setAlertMessage({type:"danger",text:err.message})
            }finally {
                setIsDeleting(false);
            }
    }
    return (
        <>
       <div className="bg-success text-white p-3 mt-4 rounded">
            <h3 style={{color:"floralwhite"}}>Update Resource</h3>
            <div className="update1">
                <Form.Label className="text-white">Choose a Resource to Update</Form.Label>
            <Form.Select className="update1" value={selectId}
            onChange={handleResourceSelect}>
                <option value="">--Click a Resource to Update</option>
                {resource && resource.map(res=>(
                    <option key={res._id} value={res._id}>
                        {res.name}
                    </option>
                ))}
            </Form.Select>
            </div>
            {selectId && 
            <Form>
                <Form.Group>
            <Form.Label className="text-light">Resource Name </Form.Label>
                <Form.Control type="text" className="lb4"
                name="name" value={updateRes.name}
                onChange={handleInput}>
                </Form.Control>
            
            <Form.Label className="lb3">Location</Form.Label>
                <Form.Control type="text" className="lb4"
                name="location" value={updateRes.location}
                onChange={handleInput}></Form.Control>
            
            <Form.Label className="lb3">Capacity </Form.Label>
                <Form.Control type="number" className="lb4"
                name="capacity" value={updateRes.capacity}
                onChange={handleInput}>
                </Form.Control>
            
            <Form.Label className="lb3">Resource Type</Form.Label>
            <Form.Control type="text" className="lb4"
                name="resourceType" value={updateRes.resourceType}
                onChange={handleInput}></Form.Control>
            
            <Form.Label className="lb3">Price per Unit</Form.Label>
                <Form.Control type="number" className="lb4"
                name="pricePerUnit" value={updateRes.pricePerUnit}
                onChange={handleInput}></Form.Control>
            
            <Form.Label className="lb3">Pricing Type</Form.Label>
                <Form.Control  type="text" className="lb4"
                name="pricingType" value={updateRes.pricingType}
                onChange={handleInput}></Form.Control>
            
                <Button type="submit" variant="warning mt-2"
                onClick={handleUpdation}>
                    {isSubmit ? "Update Resource ":"Updating Resource "}
                </Button>
                <Button
                type="button"
                variant="warning"
                onClick={handleDeleteResources}
                disabled={isSubmit || isDeleting}
                >{isDeleting ? "Deleting...":"Delete Resource"}</Button>
            </Form.Group>
            </Form>}
            {alertMessage.text && (
                        <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: "", text: "" })} dismissible>
                            {alertMessage.text}
                        </Alert>
                    )}
        </div>
        </>
    )
}