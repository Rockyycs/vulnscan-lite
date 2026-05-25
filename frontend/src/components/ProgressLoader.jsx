function Loader({ progress, logs }) {

  return (

    <div
      style={{
        marginTop: "60px",
        textAlign: "center",
      }}
    >

      <div
        style={{
          width: "90px",
          height: "90px",
          border: "8px solid #1e293b",
          borderTop: "8px solid #38bdf8",
          borderRadius: "50%",
          margin: "auto",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      <div
        style={{
          width: "60%",
          height: "22px",
          background: "#1e293b",
          borderRadius: "20px",
          margin: "40px auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              progress < 40
                ? "#ef4444"
                : progress < 80
                ? "#facc15"
                : "#22c55e",

            transition: "0.5s ease",
            borderRadius: "20px",
          }}
        ></div>
      </div>

      <h3
        style={{
          color: "#38bdf8",
          marginTop: "10px",
        }}
      >
        {progress}% Completed
      </h3>

      <h2>
        Scanning Target...
      </h2>

      <div
        style={{
          marginTop: "30px",
          background: "#020617",
          padding: "25px",
          borderRadius: "14px",
          width: "70%",
          marginInline: "auto",
          textAlign: "left",
        }}
      >

        {logs.map((log, index) => (

          <p
            key={index}
            style={{
              color: "#38bdf8",
              margin: "10px 0",
            }}
          >
            {log}
          </p>

        ))}

      </div>

    </div>

  );
}

export default Loader;
