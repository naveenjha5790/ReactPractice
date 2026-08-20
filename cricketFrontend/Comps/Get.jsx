import React, { useState, useEffect } from "react";
export default function Get({setCricketer,cricketer}){
    const [filters, setFilters] = useState({
            search: "",
            sort: "name",
            fields: "",
            numericFilters: "",
            minRuns:"",
            minBatAvg:"",
            maxBowlAvg:"",
            minTests:"",
            maxTests:"",
            minWickets:"",
            maxWickets:"",
            maxRuns:""
        });
        const [details, setDetails] = useState(false);
        const [isLoading, setIsLoading] = useState(false); 
        function inputHandler(cr){
        const { name, value } = cr.target;
        setFilters(prevs => ({
            ...prevs,
            [name]: value
        }));
    };
    async function filterStats(){
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (filters.search) queryParams.append("name", filters.search);
                if (filters.fields) queryParams.append('fields', filters.fields);
                if (filters.sort) queryParams.append("sort", filters.sort);
                if (filters.numericFilters) queryParams.append("numericFilters", filters.numericFilters);
    
                // 🟢 FIX: Verified route matches your /api/cricket base parameter endpoint route
                const numericArray=[];
                if (filters.minRuns) numericArray.push(`runs>${filters.minRuns}`)
                if (filters.minBatAvg) numericArray.push(`batAvg>${filters.minBatAvg}`);
                if (filters.minTests) numericArray.push(`tests>${filters.minTests}`);
                if (filters.minWickets) numericArray.push(`wickets>${filters.minWickets}`);
                if (filters.maxBowlAvg) {
                    numericArray.push(`bowlAvg<${filters.maxBowlAvg}`);
                    numericArray.push(`bowlAvg>0`);
                }
                if (filters.maxRuns) numericArray.push(`runs<${filters.maxRuns}`);
                if (filters.maxTests) numericArray.push(`tests<${filters.maxTests}`);
                if (filters.maxWickets) {
                    numericArray.push(`wickets<${filters.maxWickets}`);
                    numericArray.push('wickets>0');
                }

                if (numericArray.length >0){
                    queryParams.append("numericFilters",numericArray.join(","));

                }
                console.log("Firing custom calculations",queryParams.toString());

                const response = await fetch(`http://localhost:5000/api/cricket/cric?${queryParams.toString()}`);
                const data = await response.json();
                
                // 🟢 FIX: Target data.tasks to load your data correctly
                setCricketer(data.tasks || []);
            }
            catch(err){
                console.error("Advanced query failed:", err);
            }
            finally {
                setIsLoading(false);
            }
        }
    
        // FUNCTION B: Isolated Standard Home View Data Fetcher
        async function getCricketer() {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/");
                const data = await response.json();
                
                // 🟢 FIX: Target data.tasks wrapper object payload
                setCricketer(data.tasks || []);
            } catch(err) {
                console.error("Home route query failed:", err);
            } finally {
                setIsLoading(false);
            }
        }
    
        // 🟢 FIX: Trigger only the basic default home route on initial page load
        useEffect(() => {
            getCricketer();
        }, []); // Empty array ensures this triggers only once when the page loads
    
        function td(){
            setDetails(prevs => !prevs);
        }
    return (

        <>
         
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button className="btn2" onClick={td}>
                    {details ? "Hide All Details" : "Show All Statistics"}
                </button>
            </div>

            <div className="filter">
                <input type="text" name="search" placeholder="🔍 Search name..." value={filters.search} onChange={inputHandler} className="search"/>

                <select name="sort" value={filters.sort} onChange={inputHandler} className="opts">
                    <option value="name">Sort by Name (A-Z)</option>
                    <option value="-name">Sort by Name (Z-A)</option>
                    <option value="-runs">Most Runs</option>
                    <option value="-batAvg">Highest Average</option>
                    <option value="-wickets">Most Wickets</option>
                    <option value="bowlAvg">Best Bowling Avg</option>
                </select>

                <select name="fields" value={filters.fields} onChange={inputHandler} className="opts">
                    <option value="">Show All Data Columns</option>
                    <option value="name,country">Only Name and Country</option>
                    <option value="name,runs,batAvg,highestScore">Only Batting Stats</option>
                    <option value="name,wickets,bowlAvg">Only Bowling Stats</option>
                </select>
                <div className="numeric">
                    <label className="numeric1">Runs over:
                        <input type="number" name="minRuns" placeholder="e.g 1000" 
                        value={filters.minRuns} onChange={inputHandler}/>
                    </label>
                     <label className="numeric1">Batting Average Over:
                        <input type="number" name="minBatAvg" placeholder="e.g 50" 
                        value={filters.minBatAvg} onChange={inputHandler}/>
                    </label>
                     <label className="numeric1">Tests over:
                        <input type="number" name="minTests" placeholder="e.g 100" 
                        value={filters.minTests} onChange={inputHandler}/>
                    </label>
                     <label className="numeric1">Wickets over:
                        <input type="number" name="minWickets" placeholder="e.g 100" 
                        value={filters.minWickets} onChange={inputHandler}/>
                    </label>
                     <label className="numeric1">Runs under:
                        <input type="number" name="maxRuns" placeholder="e.g 1000" 
                        value={filters.maxRuns} onChange={inputHandler}/>
                    </label>
                    
                     <label className="numeric1">Bowl Average Under:
                        <input type="number" name="maxBowlAvg" placeholder="e.g 30" 
                        value={filters.maxBowlAvg} onChange={inputHandler}/>
                    </label>
                     <label className="numeric1">Tests under:
                        <input type="number" name="maxTests" placeholder="e.g 100" 
                        value={filters.maxTests} onChange={inputHandler}/></label>
                     <label className="numeric1">Wickets Under:
                        <input type="number" name="maxWickets" placeholder="e.g 100" 
                        value={filters.maxWickets} onChange={inputHandler}/>
                    </label>

                </div>

                <button className="btn1" onClick={filterStats}>
                    {isLoading ? "Syncing..." : "Apply Filters"}
                </button>

                {/* Main Render Grid Display Area */}
                <div className="wrapper">
                    {!cricketer || cricketer.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>📭 No records match active configurations.</p>
                    ) : (
                        <ul className="crics" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", listStyle: "none", padding: 0 }}>
                            {cricketer.map(cric => {
                                if (filters.sort ==='bowlAvg' && (cric.wickets===0 || !cric.bowlAvg)){
                                    return null;
                                }return (
                                <li className="cricCard" key={cric._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
                                    <h3>{cric.name}</h3>
                                    {cric.country && <p style={{ color: "#777", margin: "2px 0" }}>📍 {cric.country}</p>}
                                    
                                    {/* Clean list displaying stats under a single card wrapper */}
                                    {details && (
                                        <ul className="cricStats" style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee", listStyleType: "none", padding: 0 }}>
                                            {cric.tests !== undefined && <li><strong>Tests: </strong>{cric.tests}</li>}
                                            {cric.runs !== undefined && <li><strong>Runs Scored: </strong>{cric.runs}</li>}
                                            {cric.batAvg !== undefined && <li><strong>Batting Average: </strong>{cric.batAvg}</li>}
                                            {cric.highestScore !== undefined && <li><strong>Highest Score: </strong>{cric.highestScore}</li>}
                                            {cric.wickets > 0 && <li><strong>Wickets: </strong>{cric.wickets}</li>}
                                            {cric.bowlAvg > 0 && <li><strong>Bowling Average: </strong>{cric.bowlAvg}</li>}
                                        </ul>
                                    )}
                                </li>
                                )
                            })} 
                        </ul>
                    )})
                </div> 
            </div>
                
            </>
    )
}