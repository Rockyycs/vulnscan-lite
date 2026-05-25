import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {

  const riskData = [

    {
      name: "Critical",
      value: 5,
    },

    {
      name: "Medium",
      value: 8,
    },

    {
      name: "Low",
      value: 12,
    },

  ];

  const cveData = [

    {
      month: "Jan",
      cves: 4,
    },

    {
      month: "Feb",
      cves: 7,
    },

    {
      month: "Mar",
      cves: 5,
    },

    {
      month: "Apr",
      cves: 9,
    },

    {
      month: "May",
      cves: 6,
    },

  ];

  const COLORS = [
    "#ef4444",
    "#facc15",
    "#22c55e",
  ];

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
        }}
      >
        Threat Analytics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >

        {/* PIE CHART */}

        <div
          style={{
            background: "rgba(8,18,38,0.85)",
            padding: "35px",
            borderRadius: "24px",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            Risk Distribution
          </h2>

          <div
            style={{
              width: "100%",
              height: "350px",
            }}
          >

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >

                  {riskData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BAR CHART */}

        <div
          style={{
            background: "rgba(8,18,38,0.85)",
            padding: "35px",
            borderRadius: "24px",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            CVE Trend Analysis
          </h2>

          <div
            style={{
              width: "100%",
              height: "350px",
            }}
          >

            <ResponsiveContainer>

              <BarChart data={cveData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="cves"
                  fill="#38bdf8"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1fr 1fr",
          gap: "20px",
          marginTop: "35px",
        }}
      >

        <div
          style={{
            background:
              "rgba(8,18,38,0.85)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            Total Scans
          </p>

          <h1
            style={{
              color: "#38bdf8",
            }}
          >
            25
          </h1>

        </div>

        <div
          style={{
            background:
              "rgba(8,18,38,0.85)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            Critical Threats
          </p>

          <h1
            style={{
              color: "#ef4444",
            }}
          >
            8
          </h1>

        </div>

        <div
          style={{
            background:
              "rgba(8,18,38,0.85)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            Protected Assets
          </p>

          <h1
            style={{
              color: "#22c55e",
            }}
          >
            17
          </h1>

        </div>

        <div
          style={{
            background:
              "rgba(8,18,38,0.85)",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <p
            style={{
              color: "#64748b",
            }}
          >
            AI Accuracy
          </p>

          <h1
            style={{
              color: "#facc15",
            }}
          >
            98%
          </h1>

        </div>

      </div>

    </div>

  );
}

export default Analytics;
