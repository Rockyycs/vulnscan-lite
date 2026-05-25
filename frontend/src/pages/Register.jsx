import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      await API.post(
        "/register",
        {
          username,
          password,
        }
      );

      alert("Account created successfully");

      navigate("/");

    } catch {

      alert("Registration failed");

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #071028, #020617)",
        color: "white",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          width: "400px",
          background: "#081226",
          padding: "40px",
          borderRadius: "20px",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Create Account
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
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Already have an account?

          <Link
            to="/"
            style={{
              color: "#38bdf8",
              marginLeft: "8px",
            }}
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Register;
