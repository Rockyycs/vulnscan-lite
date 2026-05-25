import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {

  const [reports, setReports] = useState([]);

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      const response = await API.get("/scans");

      setReports(response.data);

    } catch {

      console.log("Failed to load reports");

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
          marginBottom: "45px",
          fontWeight: "bold",
        }}
      >
        Security Reports
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "30px",
        }}
      >

        {reports.map((report) => (

          <div
            key={report.id}
            style={{
              background: "rgba(8,18,38,0.85)",
              backdropFilter: "blur(12px)",

              border:
                report.score > 70
                  ? "1px solid rgba(34,197,94,0.25)"
                  : report.score > 40
                  ? "1px solid rgba(250,204,21,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",

              borderRadius: "26px",
              padding: "30px",
              position: "relative",
              overflow: "hidden",

              boxShadow:
                report.score > 70
                  ? "0 0 35px rgba(34,197,94,0.08)"
                  : report.score > 40
                  ? "0 0 35px rgba(250,204,21,0.08)"
                  : "0 0 35px rgba(239,68,68,0.08)",
            }}
          >

            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",

                background:
                  report.score > 70
                    ? "rgba(34,197,94,0.12)"
                    : report.score > 40
                    ? "rgba(250,204,21,0.12)"
                    : "rgba(239,68,68,0.12)",
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
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",

                    background:
                      report.score > 70
                        ? "#22c55e"
                        : report.score > 40
                        ? "#facc15"
                        : "#ef4444",
                  }}
                />

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    letterSpacing: "1px",
                  }}
                >
                  GENERATED REPORT
                </span>

              </div>

              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: "bold",

                  background:
                    report.score > 70
                      ? "rgba(34,197,94,0.15)"
                      : report.score > 40
                      ? "rgba(250,204,21,0.15)"
                      : "rgba(239,68,68,0.15)",

                  color:
                    report.score > 70
                      ? "#22c55e"
                      : report.score > 40
                      ? "#facc15"
                      : "#ef4444",
                }}
              >
                {report.score > 70
                  ? "SECURE"
                  : report.score > 40
                  ? "MEDIUM RISK"
                  : "CRITICAL"}
              </div>

            </div>

            <h2
              style={{
                color: "#38bdf8",
                fontSize: "22px",
                marginBottom: "18px",
              }}
            >
              {report.url}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.8",
                fontSize: "15px",
              }}
            >
              AI-generated vulnerability assessment report
              containing threat intelligence, CVE analysis,
              SSL inspection, open ports, and security posture.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
                marginBottom: "25px",
              }}
            >

              <div>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Security Score
                </p>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "44px",

                    color:
                      report.score > 70
                        ? "#22c55e"
                        : report.score > 40
                        ? "#facc15"
                        : "#ef4444",
                  }}
                >
                  {report.score}
                </h1>

              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Status
                </p>

                <h2
                  style={{
                    color: "#00ff88",
                    margin: 0,
                    fontSize: "22px",
                  }}
                >
                  READY
                </h2>

              </div>

            </div>

<button

  onClick={() => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "VULNSCAN LITE SECURITY REPORT",
      20,
      25
    );

    doc.setFontSize(14);

    doc.text(
      `Target: ${report.url}`,
      20,
      50
    );

    doc.text(
      `Security Score: ${report.score}`,
      20,
      70
    );

    doc.text(
      `Status: ${
        report.score > 70
          ? "SECURE"
          : report.score > 40
          ? "MEDIUM RISK"
          : "CRITICAL"
      }`,
      20,
      90
    );

    doc.text(
      "Generated by VulnScan Lite AI Engine",
      20,
      120
    );

    doc.text(
      "Threat Intelligence Analysis Completed.",
      20,
      140
    );

    doc.save(
      `${report.url
        .replace("https://", "")
        .replace(/\./g, "_")
      }_report.pdf`
    );

  }}

  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow:
      "0 0 20px rgba(37,99,235,0.3)",
  }}
>
  Download Intelligence Report
</button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Reports;
