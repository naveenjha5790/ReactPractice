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

        async function getCricketer() {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/");
                const data = await response.json();
                
                setCricketer(data.tasks || []);
            } catch(err) {
                console.error("Home route query failed:", err);
            } finally {
                setIsLoading(false);
            }
        }
    
        useEffect(() => {
            getCricketer();
        }, []); // Empty array ensures this triggers only once when the page loads
    
        function td(){
            setDetails(prevs => !prevs);
        }
    return (

        <>
         
            

            <div className="filter">
                
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">

                
                <input type="text" name="search" placeholder="🔍 Search name..." value={filters.search} onChange={inputHandler} className="form-control"/>
                 </div>
                 <div className="col-12 col-md-6 col-lg-4">
                <select name="sort" value={filters.sort} onChange={inputHandler} className="form-select">
                    <option value="name">Sort by Name (A-Z)</option>
                    <option value="-name">Sort by Name (Z-A)</option>
                    <option value="-runs">Most Runs</option>
                    <option value="-batAvg">Highest Average</option>
                    <option value="-wickets">Most Wickets</option>
                    <option value="bowlAvg">Best Bowling Avg</option>
                </select></div>
                    <div className="col-12 col-md-6 col-lg-4">
                <select name="fields" value={filters.fields} onChange={inputHandler} className="form-select">
                    <option value="">Show All Data Columns</option>
                    <option value="name,country">Only Name and Country</option>
                    <option value="name,runs,batAvg,highestScore">Only Batting Stats</option>
                    <option value="name,wickets,bowlAvg">Only Bowling Stats</option>
                </select>
                </div>
                </div>
                </div>
                <div className="container mt-3">
                <form>
                    <div className="row">
                    <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Runs over:
                        <input type="number" name="minRuns" placeholder="e.g 1000" 
                        value={filters.minRuns} onChange={inputHandler}
                        className="form-control" />
                    </label>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label col">Batting Average Over:
                        <input type="number" name="minBatAvg" placeholder="e.g 50" 
                        value={filters.minBatAvg} onChange={inputHandler}
                        className="form-control" />
                    </label>
                    </div>
                     <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Tests over:
                        <input type="number" name="minTests" placeholder="e.g 100" 
                        value={filters.minTests} onChange={inputHandler}
                        className="form-control" />
                    </label></div>
                     <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Wickets over:
                        <input type="number" name="minWickets" placeholder="e.g 100" 
                        value={filters.minWickets} onChange={inputHandler}
                        className="form-control" />
                    </label></div>
                     <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Runs under:
                        <input type="number" name="maxRuns" placeholder="e.g 1000" 
                        value={filters.maxRuns} onChange={inputHandler}
                        className="form-control" />
                    </label></div>
                     <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Bowl Average Under:
                        <input type="number" name="maxBowlAvg" placeholder="e.g 30" 
                        value={filters.maxBowlAvg} onChange={inputHandler}
                        className="form-control" />
                    </label></div>
                     <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Tests under:
                        <input type="number" name="maxTests" placeholder="e.g 100" 
                        value={filters.maxTests} onChange={inputHandler}
                        className="form-control"/></label></div>
                         <div className="col-12 col-md-6 col-lg-3">
                     <label className="form-label">Wickets Under:
                        <input type="number" name="maxWickets" placeholder="e.g 100" 
                        value={filters.maxWickets} onChange={inputHandler}
                         className="form-control" />
                    </label></div>
                  </div>
                  </form>
                </div>

                <button className="btn btn-success mb-3 btn-lg" onClick={filterStats}>
                    {isLoading ? "Syncing..." : "Apply Filters"}
                </button>

                <div className="container mt-4">
                    {!cricketer || cricketer.length === 0 ? (
                        <div className="text-center text-muted p-5 bg-light rounded">📭 No records match active configurations.</div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3" >
                            {cricketer.map(cric => {
                                if (filters.sort ==='bowlAvg' && (cric.wickets===0 || !cric.bowlAvg)){
                                    return null;
                                }return (
                                <div className="col" key={cric._id} >
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                    <h3 className="card-title fw-bold text-dark">{cric.name}</h3>
                                    {cric.country && <p className="card-subtitle test-muted mb-3">📍 {cric.country}</p>}

                                    {details && (
                                        <div className="border-top mt-2 pt-3">
                                        <ul className="list-unstyled mb-0 lh-lg" style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee", listStyleType: "none", padding: 0 }}>
                                            {cric.tests !== undefined && <li><strong>Tests: </strong>{cric.tests}</li>}
                                            {cric.runs !== undefined && <li><strong>Runs Scored: </strong>{cric.runs}</li>}
                                            {cric.batAvg !== undefined && <li><strong>Batting Average: </strong>{cric.batAvg}</li>}
                                            {cric.highestScore !== undefined && <li><strong>Highest Score: </strong>{cric.highestScore}</li>}
                                            {cric.wickets > 0 && <li><strong>Wickets: </strong>{cric.wickets}</li>}
                                            {cric.bowlAvg > 0 && <li><strong>Bowling Average: </strong>{cric.bowlAvg}</li>}
                                        </ul>
                                        </div>
                                    )}
                                    </div>
                                    </div>
                                </div>
                                )
                            })} 
                        </div>
                    )})
                </div> 
            </div>
                <div>
                <button className="btn btn-primary" onClick={td}>
                    {details ? "Hide All Details" : "Show All Statistics"}
                </button>
            </div>
            </>
    )
}