import React from "react";
export default function PatchDelete({setCricketer,cricketer}){

const [selectedId, setSelectedId] = React.useState("");
const [isLoading, setIsLoading] = React.useState(false); 
const [isDeleting, setIsDeleting] = React.useState(false);
    const [formData,setFormData]=React.useState({
    name: cricketer?.name || "",
        country: cricketer?.country || "",
        tests: cricketer?.tests || 0,
        runs: cricketer?.runs || 0,
        batAvg: cricketer?.batAvg || 0,
        wickets: cricketer?.wickets || 0,
        bowlAvg: cricketer?.bowlAvg || 0,
        highestScore:cricketer?.highestScore || 0
    });
    const [isSubmit,setIsSubmit]=React.useState(false);
    
    React.useEffect(() => {
        async function fetchInitialCricketers() {
            if (!cricketer || cricketer.length === 0) {
                setIsLoading(true);
                try {
                    // Hits your standard basic home route that outputs data.tasks
                    const response = await fetch("http://localhost:5000/");
                    const data = await response.json();
                    setCricketer(data.tasks || []);
                } catch (err) {
                    console.error("Failed to load players in Update screen:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchInitialCricketers();
    }, [cricketer, setCricketer]);

    function handleCricketerSelect(e) {
        const id = e.target.value;
        setSelectedId(id);

        const foundPlayer = cricketer.find(c => c._id === id);
        if (foundPlayer) {
            setFormData({
                name: foundPlayer.name || "",
                country: foundPlayer.country || "",
                tests: foundPlayer.tests || 0,
                runs: foundPlayer.runs || 0,
                batAvg: foundPlayer.batAvg || 0,
                wickets: foundPlayer.wickets || 0,
                bowlAvg: foundPlayer.bowlAvg || 0,
                highestScore: foundPlayer.highestScore || foundPlayer.highestSCore || 0
            });
        }
    }

    function handleInput(cris){
        const {name,value}=cris.target;
        const formValue=cris.target.type==="number"?Number(value) : value;
        setFormData(prev =>({
            ...prev,
            [name]:formValue
        }))
    }
    async function handleSubmit(cris){
        cris.preventDefault();
        if (!selectedId){
            alert("Please select a cricketer to upgrade");
        }
        setIsSubmit(true);
        try{
            const response=await fetch(`http://localhost:5000/api/cricket/cric?id=${selectedId}`,{
                method:"PATCH",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify({
                _id:cricketer._id,
                ...formData})
            });
            if (!response.ok){
                throw new Error("Failed to update cricketers data:");
            }
            const data=await response.json();
            setCricketer(prevs=>
                prevs.map(item=> (item._id === selectedId ? {...item,...formData}:item))
            )
            alert(`Data of ${formData.name} has been updated`)

        } catch(err){
            console.log(err)
        }finally{
            setIsSubmit(false)
        }
    }
    async function handleDeleteClick() {
        if (!selectedId) return;

        const confirmDelete = window.confirm(`⚠️ Are you sure you want to permanently delete ${formData.name}? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/cricket/cric?id=${selectedId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to delete item from backend.");
            }
            setCricketer(prevs => prevs.filter(item => item._id !== selectedId));
            
            alert(`🗑️ ${formData.name}'s profile has been removed successfully.`);
            setSelectedId("");

        } catch (err) {
            console.error(err);
            alert(`Deletion failed: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    }
    return (
        <>
        <div className="patch">
            <h3 style={{display:"flex",justifyContent:"center",fontSize:"28px",marginBottom:"15px"}}>Manage Cricketer Profile</h3>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ marginBottom: "25px"}}><strong>Choose a Player to Edit:</strong></label>
                <select value={selectedId} onChange={handleCricketerSelect} style={{ width: "30%", padding: "10px", marginLeft:"15px",borderRadius: "8px", border: "1px solid #ccc",alignItems:"center"}}>
                    <option value="">-- Click to choose a player --</option>
                    {cricketer && cricketer.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
        {selectedId && <form onSubmit={handleSubmit} className="patch1">
            <label className="lb1">Name
                    <input type="text" className="lb2" name="name" value={formData.name} onChange={handleInput}  required />
                </label>
            <label className="lb1">Country
                    <input type="text" className="lb2" name="country" value={formData.country} onChange={handleInput}  />
                </label>
            <label className="lb1">Tests Played
                    <input type="number" className="lb2" name="tests" value={formData.tests} onChange={handleInput} />
                </label>
            <label className="lb1">Runs Scored
                    <input type="number" className="lb2" name="runs" value={formData.runs} onChange={handleInput}  />
                </label>
            <label className="lb1">Batting Average
                    <input type="number" className="lb2" name="batAvg" value={formData.batAvg} onChange={handleInput} />
                </label>
            <label className="lb1">Highest Score
                    <input type="number" className="lb2" name="highestScore" value={formData.highestScore} onChange={handleInput} />
                </label>
            <label className="lb1">Bowling Average
                    <input type="number" className="lb2" name="bowlAvg" value={formData.bowlAvg} onChange={handleInput} />
                </label>
            <label className="lb1">Wickets
                    <input type="number" className="lb2" name="wickets" value={formData.wickets} onChange={handleInput}  />
                </label>
                <button type="submit" className="sub"> 
                    {isSubmit ? "Update Cricketer Profile":"Updating Data"}</button>
                    <button 
                            type="button" 
                            className="sub1" 
                            onClick={handleDeleteClick} 
                            disabled={isSubmit || isDeleting}
                            
                        >
                            {isDeleting ? "Deleting..." : "Delete Profile"}
                        </button>
            </form>}
            
        </div>
        </>
    )
}