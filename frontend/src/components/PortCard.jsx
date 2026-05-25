function PortCard({ port }) {

  return (

    <div
      style={{
        background: "#020617",
        border: "1px solid #334155",
        borderRadius: "14px",
        padding: "20px",
      }}
    >

      <h2
        style={{
          color: "#38bdf8",
          margin: 0,
        }}
      >
        Port {port.port}
      </h2>

      <p
        style={{
          marginTop: "10px",
          color: "#cbd5e1",
        }}
      >
        Service: {port.service}
      </p>

      <p
        style={{
          color:
            port.state === "open"
              ? "#22c55e"
              : "#ef4444",

          fontWeight: "bold",
        }}
      >
        State: {port.state}
      </p>

    </div>

  );
}

export default PortCard;
