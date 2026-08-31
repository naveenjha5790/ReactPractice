import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import GetReservation from "./Reservation/GetReservation";
import Create from "./Reservation/createReservation";
import GetResource from "./Resources/getResource";
import CreateResource from "./Resources/CreateResources";
import UpdateDeleteResources from "./Resources/UpdateDeleteResources";

export default function Body(){
const [user,setUser]=React.useState(null);   
const [resource,setResource]=React.useState([]);
const [reservation, setReservation] = React.useState([]);
const [showSignup,setShowSignup]=React.useState(false);
const [currentView, setCurrentView] = React.useState(null); 
const navigate=useNavigate();
const getResRef=React.useRef(null);
const handleLogout=()=>{
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
}
const refreshReservation=()=>{
    if (getResRef.current){
        getResRef.current.getRes();
    }
}
const isAdmin = user?.role?.toLowerCase() === "admin";

return (
    <>
        <Header />
        <div>
            {user && (
                <div className="dashboard">
                    <div>
                        <h3 className="logs">Welcome <span>{user.role}, {user.name} </span></h3>
                        <button onClick={handleLogout} className="logout">Logout:</button>
                    </div>
                    <div className="dashboard1">
              <Link to="/resources"><button>Manage Resources</button></Link>
              <Link to="/reservations"><button>Manage Reservations</button></Link>
            </div>
                </div>
            )} 
            
            <div className="view-display-panel">
                <Routes>
                    <Route path="/login"
                    element={!user ? (
                        <div>
                            {showSignup ? <Signup setUser={setUser} /> : <Login setUser={setUser} />}
                            <button onClick={() => setShowSignup(!showSignup)} style={{ padding: "15px", fontSize: "1.5rem", display: "block", margin: "20px auto", backgroundColor: "white", color: "black", cursor: "pointer" }}>
                    {showSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                  </button>
                        </div>
                    ):(
                        <Navigate to ={isAdmin ? "/admin/dashboard" :"/user/dashboard"} replace />
                       )}
                       />
                       <Route 
                       path="/"
                       element={user ? <Navigate to={isAdmin ? "/admin/dashboard":"/user/dashboard"} replace />: <Navigate to="/login" replace />}
                       />
                       <Route 
                       path="/admin/dashboard"
                       element={user && isAdmin ? (
                        <div className="res13">
                            <h2>Admin Control Center</h2>
                        </div>
                       ):<Navigate to="/login" replace />}
                    />
                  <Route 
              path="/user/dashboard" 
              element={user && !isAdmin ? (
                <div className="res13">
                  <h2>User Dashboard</h2>
                </div>
              ) : <Navigate to="/login" replace />} 
            />  
            <Route 
              path="/resources" 
              element={user ? (
                <div>
                  <GetResource currentUser={user} resource={resource} setResource={setResource} />

                  {isAdmin && (
                    <div className="cs">
                      <CreateResource currentUser={user} resource={resource} setResource={setResource} />
                      <UpdateDeleteResources currentUser={user} resource={resource} setResource={setResource} />
                    </div>
                  )}
                </div>
              ) : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/reservations" 
              element={user ? (
                <div className="view">
                  <Create onReservationSuccess={refreshReservation} reservation={resource} 
                  currentUser={user}/>
                  <GetReservation currentUser={user} ref={getResRef} reservation={reservation} setReservation={setReservation} />
                </div>
              ) : <Navigate to="/login" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
                
               
        </div>
    </>
);
}