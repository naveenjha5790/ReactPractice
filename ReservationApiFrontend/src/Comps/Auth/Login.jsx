import React from "react";
import { Button, Form ,Alert} from "react-bootstrap";
export default function Login({setUser}){
    const [alertMessage, setAlertMessage] = React.useState({ type: "", text: "" });
    const [newLogin,setNewLogin]=React.useState({
        email:"",
        password:""
    });
    const [isLogin,setIsLogin]=React.useState(false);
    function postHandler(use){
        const {name,value}=use.target;
        setNewLogin(prev=>({
            ...prev,[name]:value
        }))
    };

    async function doLogin(use){
            use.preventDefault();
            if (!newLogin.email || !newLogin.password){
                setAlertMessage({type:"warning",text:"Please provide correct email and password"})
                return;
            }
            setIsLogin(true);
            try {
                const payload={email:newLogin.email,
                    password:newLogin.password
                };
                const response=await fetch("http://localhost:5000/auth/login",{
            method:"POST",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify(payload)
        });
        const data=await response.json();
        if (!response.ok) {
    throw new Error(data.msg || data.message || "Invalid credentials");
}
        console.log("Successfully logged in",data);
        const newLogins=data.user || data;
        setUser(newLogins);
        if (data.token){
            localStorage.setItem("token",data.token);
        }
        setNewLogin({
            email:"",
            password:""
        });
        setAlertMessage({type:"success",text:"Login successfull!"})
            }
            catch(err){
                setAlertMessage({type:"danger",text:err.message || "Something went wrong"}
                )
            }finally{
                setIsLogin(false)
            }
    }
    return (
        <>
        <div className="text-center">
            <Form onSubmit={doLogin}>
                <Form.Group className="mb-3 p-3">
                    <Form.Control type="email" name="email" placeholder="Give your email"
                value={newLogin.email} onChange={postHandler} className="mb-3 p-3 border-secondary" >
                </Form.Control>
                <Form.Control type="password" name="password" placeholder="give your password"
                value={newLogin.password} onChange={postHandler} className="mb-1 p-3 border-warning">

                </Form.Control>
                </Form.Group>
                <Button variant="warning" type="submit" className="p-4">
                    {isLogin ? "Logging In":"Login"}
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
