import React from "react";
import Header from "./Header";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import GetReservation from "./Reservation/GetReservation";
import Create from "./Reservation/createReservation";
import GetResource from "./Resources/getResource";
import CreateResource from "./Resources/CreateResources";

export default function Body(){
const [user,setUser]=React.useState(null);   
const [resource,setResource]=React.useState([]);
const [reservation, setReservation] = React.useState([]);
const [showSignup,setShowSignup]=React.useState(false);
const [currentView, setCurrentView] = React.useState(null); 
const getResRef=React.useRef(null);
const handleLogout=()=>{
    setUser(null);
    localStorage.removeItem("token");
    setCurrentView(null);
}
const refreshReservation=()=>{
    if (getResRef.current){
        getResRef.current.getRes();
    }
}
return (
    <>
        <Header />
        <div>
            {user ? (
                <div className="dashboard">
                    <div>
                        <h3 className="logs">Welcome, <span> {user.name} </span></h3>
                        <button onClick={handleLogout} className="logout">Logout:</button>
                    </div>
                </div>
            ) : (
                <div>
                    {showSignup ? (
                        <Signup setUser={setUser} />
                    ) : (
                        <Login setUser={setUser} />
                    )}
                    <div>
                        <button 
                            onClick={() => setShowSignup(!showSignup)} 
                            style={{
                                padding: "15px", fontSize: "1.5rem", display: "block",
                                alignItems: "center", justifyContent: "center", margin: "20px auto", 
                                backgroundColor: "white", color: "black", cursor: "pointer"
                            }}
                        >
                            {showSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            )}
            <div>
                
            </div>
            {user && (<div className="dashboard1">
                 
                <button onClick={() => setCurrentView(currentView === 'resources' ? null : 'resources')}>
                    {currentView === 'resources' ? "Close Resources" : "Manage Resources"}
                </button>
                 
                <button onClick={() => setCurrentView(currentView === 'reservations' ? null : 'reservations')}>
                    {currentView === 'reservations' ? "Close Reservations" : "Manage Reservations"}
                </button>
            </div>

                )}  
            <div className="view-display-panel">
                
                {currentView === 'resources' && user && (
                    <div>
                    <GetResource currentUser={user} resource={resource} setResource={setResource} />
                    
                  {user?.role?.toLowerCase()=== "admin" && (
                        <CreateResource currentUser={user} resource={resource} setResource={setResource} />
                    
                )}
                </div>

                )}
                {currentView === 'reservations' && (
                    <div className="reservations-view-wrapper">
                        {user && (
                            <Create onReservationSuccess={refreshReservation} reservation={resource} />
                        )}
                        <GetReservation currentUser={user} ref={getResRef} reservation={reservation} setReservation={setReservation} />
                    </div>
                )}
                

                
                {user && !currentView && (
                    <div className="res13">
                        <p>Please select an action tab above to manage resources or plan slots.</p>
                    </div>
                )}
            </div>
            
        </div>
    </>
);
}