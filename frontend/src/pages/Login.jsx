import wallpaper from "../assets/bg.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response = await API.post(
        "/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    } catch {

      alert("Invalid credentials");

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
backgroundImage: `
linear-gradient(
rgba(2,6,23,0.82),
rgba(2,6,23,0.88)
),
url(${wallpaper})
`,

backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
        color: "white",
        fontFamily: "Arial",
      }}
    >

<div
  style={{
    position: "absolute",
    top: "70px",
    textAlign: "center",
    width: "100%",
  }}
>
  <h1
    style={{
      fontSize: "60px",
      margin: 0,
      color: "#38bdf8",
      fontWeight: "bold",
      letterSpacing: "2px",
    }}
  >
    VulnScan Lite
  </h1>

  <p
    style={{
      color: "#94a3b8",
      marginTop: "10px",
      fontSize: "18px",
    }}
  >
    AI-Powered Vulnerability Intelligence Platform
  </p>
</div>

<div
  style={{
    width: "520px",
    background: "rgba(2,6,23,0.88)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 40px rgba(0,0,0,0.45)",
    padding: "55px",
    borderRadius: "20px",
  }}
>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Welcome Back
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            background: "#020617",
            color: "white",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "10px",
            border: "none",
            background: "#020617",
            color: "white",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Don't have an account?

          <Link
            to="/register"
            style={{
              color: "#38bdf8",
              marginLeft: "8px",
            }}
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;
