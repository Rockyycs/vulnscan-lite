function StatCard({ title, value, color }) {

  return (

    <div
      style={{
        background: "#081226",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
      }}
    >

      <h1
        style={{
          fontSize: "55px",
          color,
          margin: 0,
        }}
      >
        {value}
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginTop: "10px",
        }}
      >
        {title}
      </p>

    </div>

  );
}

export default StatCard;
