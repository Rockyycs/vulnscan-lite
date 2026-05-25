function CVECard({ cve }) {

  return (

    <div
      style={{
        background: "#081226",
        padding: "25px",
        borderRadius: "14px",
        border:
          cve.severity === "HIGH"
            ? "1px solid #ef4444"
            : "1px solid #facc15",
      }}
    >

      <h2
        style={{
          color: "#38bdf8",
        }}
      >
        {cve.id}
      </h2>

      <p
        style={{
          color:
cve.severity === "CRITICAL"
  ? "#dc2626"
  : cve.severity === "HIGH"
  ? "#ef4444"
  : cve.severity === "MEDIUM"
  ? "#facc15"
  : "#22c55e"

          fontWeight: "bold",
        }}
      >
        Severity: {cve.severity}
      </p>

<p
  style={{
    color: "#38bdf8",
    marginTop: "10px",
    fontWeight: "bold",
  }}
>
  CVSS Score: {cve.score}
</p>

<p
  style={{
    color: "#38bdf8",
    marginTop: "10px",
    fontWeight: "bold",
  }}
>
  CVSS Score: {cve.score}
</p>

<p
  style={{
    color: "#cbd5e1",
    marginTop: "15px",
    lineHeight: "1.8",
  }}
>
  {cve.description}
</p>

    </div>

  );
}

export default CVECard;
