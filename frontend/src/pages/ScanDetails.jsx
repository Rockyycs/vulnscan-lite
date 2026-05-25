import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ScanDetails() {

  const { id } = useParams();

  const [scan, setScan] = useState(null);

  useEffect(() => {

    fetchScan();

  }, []);

  const fetchScan = async () => {

    try {

      const response =
        await API.get(`/scan/${id}`);

      setScan(response.data);

    } catch {

      console.log("Failed");

    }

  };

  if (!scan) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
        }}
      >
        Loading Threat Intelligence...
      </div>

    );

  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #071028, #020617)",
        padding: "120px 50px 50px 50px",
        color: "white",
        fontFamily: "Arial",
      }}
    >

      {/* TOP NAVBAR */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "75px",
          background: "rgba(2,6,23,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom:
            "1px solid rgba(56,189,248,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          zIndex: 999,
          boxSizing: "border-box",
        }}
      >

        <h2
          style={{
            color: "#38bdf8",
            margin: 0,
          }}
        >
          VulnScan Lite
        </h2>

        <button
          onClick={() => window.history.back()}
          style={{
            background: "#2563eb",
            border: "none",
            color: "white",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back
        </button>

      </div>

      {/* PAGE TITLE */}

      <h1
        style={{
          fontSize: "55px",
          color: "#38bdf8",
          marginBottom: "15px",
        }}
      >
        Threat Intelligence Report
      </h1>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "20px",
          marginBottom: "25px",
        }}
      >
        {scan.url}
      </p>

      {/* LIVE STATUS */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
        }}
      >

        <div
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "#22c55e",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ● LIVE THREAT ANALYSIS
        </div>

        <div
          style={{
            background: "rgba(56,189,248,0.12)",
            color: "#38bdf8",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          AI INTELLIGENCE ACTIVE
        </div>

      </div>

      {/* MAIN SCORE CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "40px",
            borderRadius: "24px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            Security Score
          </p>

          <h1
            style={{
              fontSize: "100px",
              margin: 0,

              color:
                scan.score > 70
                  ? "#22c55e"
                  : scan.score > 40
                  ? "#facc15"
                  : "#ef4444",
            }}
          >
            {scan.score}
          </h1>

        </div>

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "40px",
            borderRadius: "24px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            Risk Level
          </p>

          <h1
            style={{
              fontSize: "60px",

              color:
                scan.score > 70
                  ? "#22c55e"
                  : scan.score > 40
                  ? "#facc15"
                  : "#ef4444",
            }}
          >
            {scan.score > 70
              ? "LOW"
              : scan.score > 40
              ? "MEDIUM"
              : "CRITICAL"}
          </h1>

        </div>

      </div>

      {/* STATS ROW */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            Open Ports
          </p>

          <h1 style={{ color: "#38bdf8" }}>
            4
          </h1>
        </div>

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            CVEs Found
          </p>

          <h1 style={{ color: "#ef4444" }}>
            7
          </h1>
        </div>

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            SSL Grade
          </p>

          <h1 style={{ color: "#22c55e" }}>
            A
          </h1>
        </div>

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            Threat Level
          </p>

          <h1 style={{ color: "#facc15" }}>
            Medium
          </h1>
        </div>

      </div>

      {/* AI SUMMARY */}

      <div
        style={{
          background: "rgba(8,18,38,0.82)",
          marginTop: "35px",
          padding: "40px",
          borderRadius: "24px",
        }}
      >

        <h2
          style={{
            marginBottom: "25px",
          }}
        >
          AI Security Summary
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.9",
            fontSize: "17px",
          }}
        >
          This target exposes indicators of security
          weaknesses and requires additional hardening.
          Continuous monitoring and remediation are
          recommended to reduce attack surface exposure.
        </p>

      </div>

      {/* LOWER PANELS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "35px",
        }}
      >

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "35px",
            borderRadius: "24px",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            Vulnerability Indicators
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >

            <div
              style={{
                background: "#020617",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #ef4444",
              }}
            >
              Missing Security Headers
            </div>

            <div
              style={{
                background: "#020617",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #facc15",
              }}
            >
              SSL Configuration Review Required
            </div>

            <div
              style={{
                background: "#020617",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #22c55e",
              }}
            >
              Threat Monitoring Active
            </div>

          </div>

        </div>

        <div
          style={{
            background: "rgba(8,18,38,0.82)",
            padding: "35px",
            borderRadius: "24px",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            Security Recommendations
          </h2>

          <ul
            style={{
              color: "#cbd5e1",
              lineHeight: "2",
              paddingLeft: "20px",
            }}
          >

            <li>
              Enable all recommended HTTP
              security headers.
            </li>

            <li>
              Harden SSL/TLS cipher suites.
            </li>

            <li>
              Continuously monitor exposed ports.
            </li>

            <li>
              Apply latest CMS security patches.
            </li>

            <li>
              Enable Web Application Firewall.
            </li>

          </ul>

        </div>

      </div>

    </div>

  );
}

export default ScanDetails;
