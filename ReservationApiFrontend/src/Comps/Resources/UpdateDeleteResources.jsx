
import React from "react";
export default function UpdateDeleteResources({currentUser,resource,setResource}){
    const [selectId,setSelectId]=React.useState("");
    const [isLoading,setIsLoading]=React.useState(false);
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
            alert("Something went wrong in loading resources")
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
            alert("Please select a resource to update");
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
                alert (`Data of ${updateRes.name} has been updated`)

           
        }
        catch(err){
            console.log(err)
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
                }setResource(prevs=>prevs.filter(item=>item._id !=selectId ))
                alert (`${updateRes.name} Resource has been removed`);
                setSelectId("");
            }catch (err){
                console.log(err)
            }finally {
                setIsDeleting(false);
            }
    }
    return (
        <>
        <div className="update">
            <h3>Update Resource</h3>
            <div className="update1">
                <label>Choose a Resource to Update</label>
            <select className="update1" value={selectId}
            onChange={handleResourceSelect}>
                <option value="">--Click a Resource to Update</option>
                {resource && resource.map(res=>(
                    <option key={res._id} value={res._id}>
                        {res.name}
                    </option>
                ))}
            </select>
            </div>
            {selectId && 
            <form onSubmit={handleUpdation}
        className="update2">
            <label className="lb3">Resource Name 
                <input type="text" className="lb4"
                name="name" value={updateRes.name}
                onChange={handleInput}
                />
            </label>
            <label className="lb3">Location
                <input type="text" className="lb4"
                name="location" value={updateRes.location}
                onChange={handleInput}
                />
            </label>
            <label className="lb3">Capacity 
                <input type="number" className="lb4"
                name="capacity" value={updateRes.capacity}
                onChange={handleInput}
                />
            </label>
            <label className="lb3">Resource Type
                <input type="text" className="lb4"
                name="resourceType" value={updateRes.resourceType}
                onChange={handleInput}
                />
            </label>
            <label className="lb3">Price per Unit
                <input type="number" className="lb4"
                name="pricePerUnit" value={updateRes.pricePerUnit}
                onChange={handleInput}
                />
            </label>
            <label className="lb3">Pricing Type
                <input type="text" className="lb4"
                name="pricingType" value={updateRes.pricingType}
                onChange={handleInput}
                />
            </label>
                <button type="submit" className="sub1">
                    {isSubmit ? "Update Resource ":"Updating Resource "}
                </button>
                <button
                type="button"
                className="sub2"
                onClick={handleDeleteResources}
                disabled={isSubmit || isDeleting}
                >{isDeleting ? "Deleting...":"Delete Resource"}</button>
            </form>}
        </div>
        </>
    )
}