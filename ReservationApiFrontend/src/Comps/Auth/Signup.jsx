import React from "react";
import { Button, Form ,Alert} from "react-bootstrap";
export default function Signup({setUser}){
const [newUser, setNewUser]=React.useState({
    email:"",
    name:"",
    password:"",
    role:""
});
const [isSignup,setIsSignup]=React.useState(false);
const [alertMessage,setAlertMessage]=React.useState({type:"",text:""});
function postHandler(use){
    const {name,value}=use.target;
    setNewUser(prev=>({
        ...prev,[name]:value
    }))
};

async function handleNewUser(use){
    use.preventDefault();

    if (!newUser.name || !newUser.email ||!newUser.password){
        setAlertMessage({type:"danger",text:"Not possible to signup without name, email and password"});
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
        setAlertMessage({type:"success",text:"You have successfully signedUp"})
    }catch(err){
        setAlertMessage({type:"danger",text:"Request failed please try again!"})
    }finally{
        setIsSignup(false)
    }
}
    return (
        <>
        <div className="text-center m-3">
            <Form onSubmit={handleNewUser}>
                <Form.Group className="mb-3 p-3">
                    <Form.Control  type="text" name="name" placeholder="full name"
                value={newUser.name} onChange={postHandler} className="mb-3 p-3">
                </Form.Control>
                <Form.Control  type="email" name="email" placeholder="Email ID"
                value={newUser.email} onChange={postHandler} required className="mb-3 p-3">
                </Form.Control>
                <Form.Control type="password" name="password" placeholder="Provide password"
                value={newUser.password} onChange={postHandler} required className="mb-3 p-3">
                </Form.Control>
                
                <Form.Control type="text" name="role" placeholder="Role"
                value={newUser.role} onChange={postHandler} className="mb-3 p-3"
                >
                </Form.Control>
                <Button variant="danger" type="submit" >
                    {isSignup ? "Registering ...":"Sign Up"}
                </Button>
                </Form.Group>
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