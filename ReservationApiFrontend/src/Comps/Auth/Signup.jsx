import React from "react";
export default function Signup({setUser}){
const [newUser, setNewUser]=React.useState({
    email:"",
    name:"",
    password:"",
    role:""
});
const [isSignup,setIsSignup]=React.useState(false);
function postHandler(use){
    const {name,value}=use.target;
    setNewUser(prev=>({
        ...prev,[name]:value
    }))
};

async function handleNewUser(use){
    use.preventDefault();

    if (!newUser.name || !newUser.email ||!newUser.password){
        alert("Not possible to signup without name, email and password");
        return;
    }
    setIsSignup(true);
    try{
        const payload={
            email:newUser.email,
            name:newUser.name,
            password:newUser.password,
            role:newUser.role || "User"
        }
        const response=await fetch("http://localhost:5000/auth/register",{
            method:"POST",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify(payload)
        })
        const data=await response.json();
        console.log("User created successfully");
        const newestUser=data.user ||data;
        setUser(prevs=>{
            const safeList = Array.isArray(prevs) ? prevs : [];
            return [newestUser,...safeList]
        });
        setNewUser({
            name:"",email:"",password:"",role:""
        })
        alert("You have successfully signedUp")
    }catch(err){
        console.log("Request failed Please try again!")
    }finally{
        setIsSignup(false)
    }
}
    return (
        <>
        <div className="signup">
            <form onSubmit={handleNewUser} className="signup1">
                <input type="text" name="name" placeholder="full name"
                value={newUser.name} onChange={postHandler} />
                <input type="email" name="email" placeholder="Email ID"
                value={newUser.email} onChange={postHandler} required />
                <input type="password" name="password" placeholder="Provide password"
                value={newUser.password} onChange={postHandler} required />
                <input type="text" name="role" placeholder="Role"
                value={newUser.role} onChange={postHandler} />
                <button type="submit" className="signup2">
                    {isSignup ? "Registering ...":"Sign Up"}
                </button>
            </form>
            
        </div>
        </>
    )
}