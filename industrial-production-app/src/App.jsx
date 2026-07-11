import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import ProductionForm from "./ProductionForm";
import "./App.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import ProductionLogs from "./ProductionLogs";

function App() {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [formData, setFormData] = useState({
    lineId: "",
    status: "Running",
    throughput: 0,
    message: "",
    operator: "",
  });

  const [liveUpdates, setLiveUpdates] = useState([]);
  const [view, setView] = useState("form");

  useEffect(() => {
    if (!token) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7076/production-updates", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        newConnection.on("OnLogBatchInserted", (message) => {
          setLiveUpdates((prev) => [message, ...prev]);
        });
      })
      .catch((error) => console.error("SignalR Connection Error: ", error));

    return () => {
      newConnection.off("OnLogBatchInserted");
      newConnection.stop();
    };
  }, [token]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "throughput" ? Number(value) : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7076/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProductionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = [{ ...formData, timestamp: new Date().toISOString() }];

    try {
      const response = await fetch(
        "https://localhost:7076/api/production/process-batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error("Transmission failed");
      alert("Telemetry successfully dispatched!");
      setFormData({
        lineId: "",
        status: "Running",
        throughput: 0,
        message: "",
        operator: "",
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      {!token ? (
        <LoginForm
          loginData={loginData}
          onChange={handleLoginChange}
          onLogin={handleLogin}
        />
      ) : (
        <div>
          <div className="session-header">
            <div className="nav-controls">
              <span className="status-indicator">✓ Secure Session Active</span>
              <button
                onClick={() => setView("form")}
                className={`btn-nav ${view === "form" ? "active" : ""}`}
              >
                New Entry
              </button>
              <button
                onClick={() => setView("logs")}
                className={`btn-nav ${view === "logs" ? "active" : ""}`}
              >
                View History
              </button>
            </div>
            <button onClick={() => setToken("")} className="btn btn-danger">
              Logout
            </button>
          </div>

          {view === "form" ? (
            <ProductionForm
              formData={formData}
              onChange={handleProductionChange}
              onSubmit={handleProductionSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ProductionLogs token={token} />
          )}
          {liveUpdates.length > 0 && (
            <div className="live-alerts-container">
              <h3>⚡ Live WebSocket Feeds ({liveUpdates.length})</h3>
              {liveUpdates.flatMap((batch, batchIdx) =>
                batch.map((log, logIdx) => (
                  <div key={`${batchIdx}-${logIdx}`} className="alert-card">
                    <strong>Line {log.lineId}:</strong> {log.operator} -{" "}
                    {log.status} ({log.throughput} tons/hr)
                    {console.log("Live Update Log:", log)}
                  </div>
                )),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
