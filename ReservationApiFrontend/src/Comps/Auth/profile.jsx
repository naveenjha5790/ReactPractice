import React from "react";
import { Card } from "react-bootstrap";
export default function ProfileView() {
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [alertMessage,setAlertMessage]=React.useState({type:"",text:""});

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProfileData(data.myProfile);
        } else {
          setAlertMessage({type:"danger",text:data.message || "Failed to load account profile"});
        }
      } catch (err) {
        console.error(err);
        setAlertMessage({type:"danger",text:err});
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <p style={{ textAlign: "center", color: "black" }}>Loading profile details...</p>;
  if (!profileData) return <p style={{ textAlign: "center", color: "red" }}>Error rendering profile workspace.</p>;

  return (
  
    <Card className="h-100 shadow-sm border-0 bg-white rounded p-2 m-3">
            <Card.Body className="d-flex flex-column justify-content-between p-3">
                <Card.Title className="d-flex align-items-start justify-content-between
                mb-3">
                    My Profile
                </Card.Title>
                <Card.Text className="text-secondary small mb-2">
                    <strong>Name: </strong>{profileData.name}
                </Card.Text>
                <Card.Text className="text-secondary small mb-2">
                    <strong>Email: </strong>{profileData.email}
                </Card.Text>
                <Card.Text className="text-secondary small mb-2">
                    <strong>System Role: </strong>{profileData.role}
                </Card.Text>
                <Card.Text className="text-secondary small mb-2">
                    <strong>User ID Reference </strong><code>{profileData._id}</code>
                </Card.Text>
            </Card.Body>
            </Card>
    
  )
}