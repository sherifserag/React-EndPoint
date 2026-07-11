import { useState, useEffect } from "react";

function ProductionLogs({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchProductionLogs = async () => {
      try {
        const response = await fetch(
          "https://localhost:7076/api/Production/get-Production-Logs",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch production logs");
        const data = await response.json();
        if (!Array.isArray(data))
          throw new Error("Invalid data format received");
        setLogs(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching production logs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionLogs();
  }, [token]);

  if (loading) return <div>Loading production logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="panel">
      <h2>Historical Production Logs</h2>
      <div className="logs-list">
        {logs.length === 0 ? (
          <p>No records found in database.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <div className="log-meta">
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span
                  className={`log-status status-${log.status.toLowerCase()}`}
                >
                  {log.status}
                </span>
              </div>
              <div className="log-details">
                <p>
                  <strong>Throughput:</strong> {log.throughput} tons/hr
                </p>
                <p>
                  <strong>Operator:</strong> {log.operator}
                </p>
                {log.message && (
                  <p>
                    <strong>Message:</strong> {log.message}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductionLogs;
