import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Scans() {

  const [scans, setScans] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    fetchScans();

  }, []);

  const fetchScans = async () => {

    try {

      const response = await API.get("/scans");

      setScans(response.data);

    } catch {

      console.log("Failed to load scans");

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #071028, #020617)",
        padding: "50px",
        color: "white",
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          fontSize: "58px",
          color: "#f8fafc",
          marginBottom: "50px",
          letterSpacing: "-2px",
        }}
      >
        Threat Intelligence Center
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
          gap: "30px",
        }}
      >

        {scans.map((scan) => (

          <div
            key={scan.id}
onClick={() =>
  navigate(`/scan/${scan.id}`)
}
            style={{
              background: "rgba(8,18,38,0.82)",
              backdropFilter: "blur(10px)",

              border:
                scan.score > 70
                  ? "1px solid rgba(34,197,94,0.25)"
                  : scan.score > 40
                  ? "1px solid rgba(250,204,21,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",

              padding: "30px",
              borderRadius: "24px",

              boxShadow:
                scan.score > 70
                  ? "0 0 25px rgba(34,197,94,0.12)"
                  : scan.score > 40
                  ? "0 0 25px rgba(250,204,21,0.12)"
                  : "0 0 25px rgba(239,68,68,0.12)",

              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-6px)";

              e.currentTarget.style.boxShadow =
                scan.score > 70
                  ? "0 0 40px rgba(34,197,94,0.22)"
                  : scan.score > 40
                  ? "0 0 40px rgba(250,204,21,0.22)"
                  : "0 0 40px rgba(239,68,68,0.22)";

            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";

              e.currentTarget.style.boxShadow =
                scan.score > 70
                  ? "0 0 25px rgba(34,197,94,0.12)"
                  : scan.score > 40
                  ? "0 0 25px rgba(250,204,21,0.12)"
                  : "0 0 25px rgba(239,68,68,0.12)";

            }}
          >

            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  scan.score > 70
                    ? "rgba(34,197,94,0.08)"
                    : scan.score > 40
                    ? "rgba(250,204,21,0.08)"
                    : "rgba(239,68,68,0.08)",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >

                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background:
                      scan.score > 70
                        ? "#22c55e"
                        : scan.score > 40
                        ? "#facc15"
                        : "#ef4444",

                    boxShadow:
                      scan.score > 70
                        ? "0 0 12px #22c55e"
                        : scan.score > 40
                        ? "0 0 12px #facc15"
                        : "0 0 12px #ef4444",
                  }}
                />

                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    letterSpacing: "1px",
                  }}
                >
                  LIVE REPORT
                </span>

              </div>

              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: "bold",

                  background:
                    scan.score > 70
                      ? "rgba(34,197,94,0.15)"
                      : scan.score > 40
                      ? "rgba(250,204,21,0.15)"
                      : "rgba(239,68,68,0.15)",

                  color:
                    scan.score > 70
                      ? "#22c55e"
                      : scan.score > 40
                      ? "#facc15"
                      : "#ef4444",
                }}
              >
                {scan.score > 70
                  ? "LOW RISK"
                  : scan.score > 40
                  ? "MEDIUM RISK"
                  : "CRITICAL"}
              </div>

            </div>

            <h2
              style={{
                color: "#38bdf8",
                marginBottom: "14px",
                fontSize: "32px",
                wordBreak: "break-word",
              }}
            >
              {scan.url}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "15px",
                marginBottom: "18px",
                lineHeight: "1.7",
              }}
            >
              AI vulnerability assessment completed successfully.
              Threat intelligence engine analyzed attack surface,
              SSL configuration, open ports, and exposed CVEs.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "25px",
              }}
            >

              <div>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    marginBottom: "6px",
                  }}
                >
                  Security Score
                </p>

                <h3
                  style={{
                    color:
                      scan.score > 70
                        ? "#22c55e"
                        : scan.score > 40
                        ? "#facc15"
                        : "#ef4444",

                    margin: 0,
                    fontSize: "34px",
                  }}
                >
                  {scan.score}
                </h3>

              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    marginBottom: "6px",
                  }}
                >
                  Status
                </p>

                <p
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  COMPLETED
                </p>

              </div>

            </div>

            <p
              style={{
                color: "#64748b",
                marginTop: "28px",
                fontSize: "13px",
                borderTop:
                  "1px solid rgba(255,255,255,0.05)",
                paddingTop: "18px",
              }}
            >
              Scan completed • Real-time threat intelligence
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Scans;
