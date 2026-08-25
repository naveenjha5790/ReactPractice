import React from "react";
export default function Login({setUser}){
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
                alert ("Please provide name and password");
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
        alert("Login successfull!")
            }
            catch(err){
                console.log(err);
            }finally{
                setIsLogin(false)
            }
    }
    return (
        <>
        <div className="login">
            <form onSubmit={doLogin} className="login1">
                <input type="email" name="email" placeholder="Give your email"
                value={newLogin.email} onChange={postHandler} />
                <input type="password" name="password" placeholder="give your password"
                value={newLogin.password} onChange={postHandler} />
                <button type="submit" className="login2">
                    {isLogin ? "Logging In":"Login"}
                </button>
            </form>
        </div>
        </>
    )
}
