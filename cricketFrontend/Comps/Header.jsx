import logo from '../logo.jpg'
export default function Header(){
    return (
       
            <nav class="navbar d-flex align-items-center justify-content-center navbar-expand bg-primary text-white fixed-top m-0" style={{height:"100px", zindex:1039}}
             >
            <h1 className="m-5 fs-3 fw-bold">🏏 Cricketer Hub Panel </h1>
            <img src={logo} className='img-fluid' style={{height:"30px",width:"20px"}}/>
            </nav>
        
    )
}