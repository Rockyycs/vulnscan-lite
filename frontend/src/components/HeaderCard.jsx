function HeaderCard({ item }) {

  return (

    <div
      style={{
        background: "#081226",
        padding: "25px",
        borderRadius: "14px",
        border:
          item.status === "Present"
            ? "1px solid #22c55e"
            : "1px solid #ef4444",
      }}
    >

      <h2
        style={{
          color: "#38bdf8",
        }}
      >
        {item.header}
      </h2>

      <p
        style={{
          color:
            item.status === "Present"
              ? "#22c55e"
              : "#ef4444",

          fontWeight: "bold",
        }}
      >
        {item.status}
      </p>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.8",
        }}
      >
        {item.description}
      </p>

      {item.remediation && (

        <div
          style={{
            marginTop: "20px",
            background: "#020617",
            padding: "15px",
            borderRadius: "10px",
          }}
        >

          <strong
            style={{
              color: "#facc15",
            }}
          >
            Remediation:
          </strong>

          <p
            style={{
              marginTop: "10px",
              color: "#cbd5e1",
            }}
          >
            {item.remediation}
          </p>

        </div>

      )}

    </div>

  );
}

export default HeaderCard;
