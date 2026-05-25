import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // 1. STATE INITIALIZATION & SYSTEM HOOKS
  // ==========================================
  const [activePage, setActivePage] = useState("dashboard");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStage, setScanStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // ==========================================
  // 2. STYLING ARCHITECTURE & DESIGN SYSTEM
  // ==========================================
  const theme = {
    bg: "#020617",
    cardBg: "#0f172a",
    innerBg: "#1e293b",
    border: "1px solid rgba(51, 65, 85, 0.35)",
    borderRadius: "16px",
    font: "'Inter', system-ui, -apple-system, sans-serif",
    colors: {
      critical: "#f43f5e",
      high: "#f97316",
      medium: "#eab308",
      secure: "#10b981",
      info: "#38bdf8",
      muted: "#94a3b8",
      text: "#f8fafc"
    }
  };

  const layoutStyles = {
    card: {
      background: theme.cardBg,
      border: theme.border,
      borderRadius: theme.borderRadius,
      padding: "36px",
      boxShadow: "0 8px 30px -2 rgba(0, 0, 0, 0.5)"
    },
    subContainer: {
      background: "#131c2e",
      padding: "20px 24px",
      borderRadius: "12px",
      border: "1px solid rgba(51, 65, 85, 0.2)"
    }
  };

  // ==========================================
  // 3. CORE CORE SUBSYSTEM LOGIC & ROUTING
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.log("Failed to fetch history from local API engine backend location.", err);
    }
  };

  const pollScanStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await API.get(`http://127.0.0.1:8000/scan/status/${taskId}`);
        const status = response.data.status;

        if (status === "PENDING") {
          setProgress(25);
          setScanStage("Queued In Scan Engine");
        } else if (status === "STARTED") {
          setProgress(70);
          setScanStage("Running Vulnerability Analysis");
        } else if (status === "SUCCESS") {
          clearInterval(interval);
          setProgress(100);
          setScanStage("Threat Intelligence Ready");
          setResult(response.data.result);
          setLoading(false);
          fetchHistory();
        } else if (status === "FAILURE") {
          clearInterval(interval);
          setLoading(false);
          alert("Scan failed");
        }
      } catch (err) {
        clearInterval(interval);
        setLoading(false);
        console.error("Polling instance error caught", err);
      }
    }, 2000);
  };

  const startScan = async () => {
    if (!url) {
      alert("Enter a URL");
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      setProgress(10);
      setScanStage("Initializing Scan Engine...");
      const response = await API.post("http://127.0.0.1:8000/scan", { url });
      const taskId = response.data.task_id;
      pollScanStatus(taskId);
    } catch (err) {
      setLoading(false);
      alert("Scan failed to initiate context pipeline modules.");
    }
  };

  const downloadPDF = async () => {
    if (!result) {
      alert("No active scan result matrix layout found to compile.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/download-report", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          target: url || "Unknown Target System Map",
          score: result.score || 0,
          grade: result.grade || "N/A",
          headers: result.headers || [],
          cves: result.cves || [],
          ports: result.ports || [],
          ssl: result.ssl || {},
          summary: result.summary || ""
        }),
      });

      if (!response.ok) {
        throw new Error(`Server engine responded with status code: ${response.status}`);
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = `security_report_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup DOM footprint elements mapping context
      window.URL.revokeObjectURL(fileUrl);
      a.remove();
    } catch (err) {
      console.error("PDF generation engine pipeline failure details:", err);
      alert(`Failed to compile report stream down: ${err.message}`);
    }
  };

  // ==========================================
  // 4. DATA MATRIX GENERATION & TRANSFORMS
  // ==========================================
  const threatData = [
    { name: "Critical", value: result?.headers?.filter((h) => h.status === "Missing").length || 0 },
    { name: "Medium", value: result?.cves?.length || 0 },
    { name: "Secure", value: result?.headers?.filter((h) => h.status === "Present").length || 0 },
  ];

  const CHART_COLORS = [theme.colors.critical, theme.colors.medium, theme.colors.secure];

  // ==========================================
  // 5. RENDER RENDERING ENGINE COMPONENT INTERFACE
  // ==========================================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.colors.text,
        padding: "50px 32px",
        fontFamily: theme.font,
        WebkitFontSmoothing: "antialiased"
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "36px" }}>
        
        {/* --- GLOBAL APPLICATION NAVBAR MODULE --- */}
        <header style={{ ...layoutStyles.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 44px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "800", letterSpacing: "-0.04em", color: theme.colors.text }}>
              VulnScan<span style={{ color: theme.colors.info }}>Lite</span>
            </h1>
            <p style={{ color: theme.colors.muted, fontSize: "16px", marginTop: "8px", marginBottom: 0 }}>
              AI-Powered Passive Threat Intelligence Engine Pipeline
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <Link to="/dashboard" style={{ color: theme.colors.info, textDecoration: "none", fontSize: "18px", fontWeight: "600" }}>Dashboard</Link>
            <button
              onClick={() => setActivePage("scans")}
              style={{
                background: "none",
                border: "none",
                color: activePage === "scans" ? theme.colors.info : theme.colors.muted,
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                transition: "color 0.2s"
              }}
            >
              Scans
            </button>
            <Link to="/reports" style={{ color: theme.colors.muted, textDecoration: "none", fontSize: "18px", fontWeight: "600" }}>Reports</Link>
            <Link to="/analytics" style={{ color: theme.colors.muted, textDecoration: "none", fontSize: "18px", fontWeight: "600" }}>Analytics</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              style={{
                background: "rgba(244, 63, 94, 0.1)",
                border: "1px solid rgba(244, 63, 94, 0.2)",
                color: theme.colors.critical,
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "700"
              }}
            >
              Logout Engine
            </button>
          </div>
        </header>

        {/* --- INPUT DEPLOYMENT MATRIX CONTAINER --- */}
        <section style={layoutStyles.card}>
          <p style={{ color: theme.colors.info, fontSize: "14px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>Target Sub-System</p>
          <h2 style={{ marginTop: "10px", marginBottom: "28px", fontSize: "28px", fontWeight: "600" }}>Deploy New Vulnerability Intelligence Analysis</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter target mapping context domain name string (e.g., https://scope-target.com)"
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background: "#030712",
                color: "white",
                fontSize: "18px",
                fontFamily: "monospace",
                outline: "none"
              }}
            />
            <button
              onClick={startScan}
              disabled={loading}
              style={{
                padding: "20px 40px",
                borderRadius: "12px",
                border: "none",
                background: loading ? "#1e293b" : theme.colors.info,
                color: loading ? theme.colors.muted : "#020617",
                fontWeight: "800",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "18px",
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Analyzing Target..." : "Execute Analysis"}
            </button>
          </div>
        </section>

        {/* --- PIPELINE TELEMETRY PROGRESS RUN TRACKER --- */}
        {loading && (
          <div style={layoutStyles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#e2e8f0" }}>{scanStage}</h3>
              <span style={{ fontSize: "20px", fontWeight: "800", color: theme.colors.info }}>{progress}%</span>
            </div>
            <div style={{ width: "100%", height: "12px", background: "#1e293b", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: progress < 40 ? theme.colors.critical : progress < 80 ? theme.colors.medium : theme.colors.secure,
                  transition: "width 0.4s ease-in-out"
                }}
              />
            </div>
          </div>
        )}

        {/* --- DYNAMIC HISTORICAL SCANS TAB LOG ARCHIVE --- */}
        {activePage === "scans" && (
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "28px" }}>
            {history?.map((scan, index) => (
              <div key={index} style={layoutStyles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span style={{ color: theme.colors.muted, fontSize: "14px", fontWeight: "700" }}>ENGINE HISTORIC RUN</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      padding: "6px 14px",
                      borderRadius: "99px",
                      background: scan.score >= 80 ? "rgba(16,185,129,0.08)" : scan.score >= 60 ? "rgba(234,179,8,0.08)" : "rgba(244,63,94,0.08)",
                      color: scan.score >= 80 ? theme.colors.secure : scan.score >= 60 ? theme.colors.medium : theme.colors.critical,
                    }}
                  >
                    {scan.score >= 80 ? "LOW RISK PROFILE" : scan.score >= 60 ? "ELEVATED RISK" : "CRITICAL RISK PROFILE"}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                  {scan.target}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(51, 65, 85, 0.3)", paddingTop: "20px" }}>
                  <div>
                    <span style={{ color: theme.colors.muted, fontSize: "15px" }}>Calculated Score</span>
                    <h2 style={{ margin: 0, fontSize: "36px", color: scan.score >= 80 ? theme.colors.secure : scan.score >= 60 ? theme.colors.medium : theme.colors.critical }}>
                      {scan.score}
                    </h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: theme.colors.muted, fontSize: "15px" }}>Status Code</span>
                    <p style={{ margin: "6px 0 0 0", fontSize: "16px", fontWeight: "700", color: theme.colors.secure }}>COMPLETED_OK</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* --- PRIMARY DATA EVALUATION RESULTS BLOCK GRID ARCHITECTURE --- */}
        {result && (
          <main style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: "36px", alignItems: "start" }}>
            
            {/* ==========================================
                LEFT-SIDEBAR: CORE COMPONENT PANEL METRICS
                ========================================== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* PRIMARY EMBEDDED CIRCULAR INTEGRITY RATIO SCORE VIEW */}
              <div style={{ ...layoutStyles.card, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "44px 32px" }}>
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    border: `10px solid ${theme.colors.secure}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(16,185,129,0.02)",
                    boxShadow: "inset 0 0 24px rgba(16,185,129,0.05)"
                  }}
                >
                  <h1 style={{ fontSize: "68px", margin: 0, fontWeight: "800", color: theme.colors.secure }}>{result?.score}</h1>
                  <span style={{ color: theme.colors.muted, fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Security Index</span>
                </div>
                <h2 style={{ marginTop: "24px", margin: 0, fontSize: "22px", fontWeight: "600", color: theme.colors.info }}>Evaluated Target Class Grade: {result?.grade}</h2>
              </div>

              {/* STAT GRID MULTI-COUNTER COUNTERS SPLIT SUB CONTAINER */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {[
                  { title: "Threat Vectors Found", value: result?.headers?.filter((h) => h.status === "Missing").length || 0, color: theme.colors.critical },
                  { title: "Compliant Mappings", value: result?.headers?.filter((h) => h.status === "Present").length || 0, color: theme.colors.secure },
                  { title: "Matched Vulnerabilities", value: result?.cves?.length || 0, color: theme.colors.medium },
                  { title: "Identified Network Ports", value: result?.ports?.length || 0, color: theme.colors.info },
                ].map((item, index) => (
                  <div key={index} style={{ ...layoutStyles.card, padding: "24px" }}>
                    <h2 style={{ color: item.color, margin: 0, fontSize: "38px", fontWeight: "800" }}>{item.value}</h2>
                    <p style={{ color: theme.colors.muted, marginTop: "8px", marginBottom: 0, fontSize: "15px", fontWeight: "500", lineHeight: "1.4" }}>{item.title}</p>
                  </div>
                ))}
              </div>

              {/* AUTHENTICATION LAYER METRIC CONTAINER DATA STRIP (SSL) */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Transport Encryption Context</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(51,65,85,0.2)", paddingBottom: "10px" }}>
                    <span style={{ color: theme.colors.muted }}>Issuing Agent</span>
                    <span style={{ fontWeight: "600", color: "#e2e8f0" }}>{result?.ssl?.issuer || "Unknown Class Instance"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(51,65,85,0.2)", paddingBottom: "10px" }}>
                    <span style={{ color: theme.colors.muted }}>Time Boundaries</span>
                    <span style={{ fontWeight: "600", color: "#e2e8f0" }}>{result?.ssl?.expires || "N/A Boundary Map"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ color: theme.colors.muted }}>Active Cipher Sequence Configuration</span>
                    <span style={{ fontWeight: "500", fontFamily: "monospace", fontSize: "14px", color: theme.colors.info, wordBreak: "break-all", background: "#040712", padding: "10px", borderRadius: "6px", border: "1px solid rgba(51, 65, 85, 0.3)" }}>
                      {result?.ssl?.cipher || "Unknown Cryptography Context Parameters"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ARCHITECTURE CMS COMPONENT PROFILE BLOCKS UNIT */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Core Base Framework Fingerprint</h3>
                <div style={{ ...layoutStyles.subContainer, padding: "28px", textAlign: "center" }}>
                  <h2 style={{ color: theme.colors.info, fontSize: "36px", margin: 0, fontWeight: "800", letterSpacing: "-0.02em" }}>
                    {result?.cms?.name || "Undetermined Footprint Stack"}
                  </h2>
                  <p style={{ color: theme.colors.muted, fontSize: "15px", margin: "10px 0 0 0", fontWeight: "600" }}>
                    Risk Vector Metric Calculation Level: <span style={{ color: theme.colors.secure }}>{result?.cms?.risk || "Minimal Risk Area"}</span>
                  </p>
                </div>
              </div>

              {/* SOCKET DATA PORT ACCESS INTERFACE LIST CHIP MATRIX */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Network Interface Port Vector Matrices</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result?.ports?.length > 0 ? (
                    result.ports.map((port, index) => (
                      <div key={index} style={{ ...layoutStyles.subContainer, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
                        <span style={{ fontWeight: "700", color: theme.colors.info, fontSize: "15px", fontFamily: "monospace" }}>SOCKET PORT {port.port}</span>
                        <span style={{ fontSize: "14px", color: theme.colors.muted, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "600" }}>
                          {port.service} Protocol
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: theme.colors.muted, fontSize: "16px", margin: "4px 0 0 0", fontStyle: "italic" }}>
                      No structural access port routing flags returned.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* ==========================================
                RIGHT-SIDEBAR: PRIMARY MATRIX GRIDS CONTENT
                ========================================== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* ANALYTICS CHARTS DONUT SPLIT WRAP CONTAINER VIEW ROW */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                
                {/* UPGRADED DONUT DESIGN PIE CHART ENGINE */}
                <div style={layoutStyles.card}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Threat Analytics Index</h3>
                  <div style={{ width: "100%", height: "240px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={threatData} cx="50%" cy="50%" innerRadius={70} outerRadius={92} paddingAngle={4} dataKey="value">
                          {threatData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", fontSize: "15px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* HEURISTIC REASONER RISK PROFILE TEXT BOX CHIP */}
                <div style={layoutStyles.card}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Heuristic Risk Profile Digest</h3>
                  <p style={{ color: "#cbd5e1", fontSize: "17px", lineHeight: "1.7", margin: 0 }}>{result.summary}</p>
                </div>
              </div>

              {/* SECURITY ENFORCEMENTS FRAMEWORK RESPONSE ARRAY DISPLAY ROW LIST */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>HTTP Response Security Framework Enforcement Matrix</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {result?.headers?.map((header, index) => (
                    <div key={index} style={{ ...layoutStyles.subContainer, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "600", fontSize: "16px", fontFamily: "monospace", color: "#cbd5e1" }}>{header.header}</span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "800",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          letterSpacing: "0.06em",
                          background: header.status === "Present" ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)",
                          color: header.status === "Present" ? theme.colors.secure : theme.colors.critical,
                        }}
                      >
                        {header.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* REALTIME FIREWALL FEED LOGS CONTAINER ROW DATA STRIP */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Aggregated Cyber Sandbox Security Attack Threat Feed Logs</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { ip: "185.220.101.12", attack: "SQL Injection Vectors Exploitation Attempt Instance", severity: "Critical Threat Profile", color: theme.colors.critical, bg: "rgba(244,63,94,0.02)" },
                    { ip: "45.88.120.1", attack: "Cross-Site Scripting (XSS) Remote Execution Payload Inject", severity: "Medium Variant Action", color: theme.colors.medium, bg: "rgba(234,179,8,0.02)" },
                    { ip: "91.210.175.22", attack: "Automated Encrypted Dictionary Authentication Brute Force", severity: "High Fault Severity", color: theme.colors.critical, bg: "rgba(244,63,94,0.02)" },
                  ].map((threat, index) => (
                    <div key={index} style={{ ...layoutStyles.subContainer, display: "flex", justifyContent: "space-between", alignItems: "center", background: threat.bg }}>
                      <div>
                        <span style={{ fontSize: "16px", fontWeight: "700", fontFamily: "monospace", color: theme.colors.text }}>{threat.ip}</span>
                        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: theme.colors.muted }}>{threat.attack}</p>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "800", color: threat.color, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        {threat.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHIP WRAPPERS SUMMARY PREVIEW LOGS SUB-ARRAY LIST ROW CONTAINER */}
              <div style={layoutStyles.card}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#cbd5e1" }}>Recent System Context Execution Maps</h3>
                <div style={{ gridTemplateColumns: "1fr 1fr 1fr", display: "grid", gap: "16px" }}>
                  {history.slice(0, 3).map((scan, index) => (
                    <div key={index} style={{ ...layoutStyles.subContainer, background: "#131c2e", padding: "16px" }}>
                      <h4 style={{ margin: 0, fontSize: "14px", color: theme.colors.info, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                        {scan.url}
                      </h4>
                      <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: theme.colors.muted }}>
                        Score Metric Evaluation:{" "}
                        <span style={{ fontWeight: "700", color: scan.score > 70 ? theme.colors.secure : scan.score > 40 ? theme.colors.medium : theme.colors.critical }}>
                          {scan.score}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GLOBAL EXPORT COMPILATION ACTION TRIGGER BANNER TRIGGER */}
              <button
                onClick={downloadPDF}
                style={{
                  width: "100%",
                  padding: "22px",
                  background: theme.colors.secure,
                  color: "#020617",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "18px",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
                  transition: "opacity 0.2s"
                }}
              >
                Compile & Export Comprehensive Intelligence PDF Report Log
              </button>

            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
