import { useState } from "react";

function App() {
  const [fromData, setFromData] = useState({
    status: "Running",
    throughput: 0,
    message: "",
    operator: "",
  });

  const [networkStatus, setNetworkStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFromData((prevData) => ({
      ...prevData,
      [name]: name === "throughput" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNetworkStatus({ type: "", text: "" });

    const payload = [
      {
        ...fromData,
        timestamp: new Date().toISOString(),
      },
    ];

    try {
      const response = await fetch(
        "https://localhost:7076/api/production/process-batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      setNetworkStatus({
        type: "success",
        text: "Telemetry successfully dispatched to the server!",
      });

      setFromData({
        lineId: 0,
        status: "Running",
        throughput: 0,
        message: "",
        operator: "",
      });
    } catch (error) {
      setNetworkStatus({
        type: "error",
        text: error.message || "Network communication failure.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPayloadPreview = [
    {
      ...fromData,
      timestamp: new Date().toISOString(),
    },
  ];

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        display: "flex",
        gap: "40px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          background: "#1c2538",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <h2>New Production Item</h2>

        {networkStatus.text && (
          <div
            style={{
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "16px",
              background:
                networkStatus.type === "success"
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${networkStatus.type === "success" ? "#10b981" : "#ef4444"}`,
              color: networkStatus.type === "success" ? "#34d399" : "#f87171",
            }}
          >
            {networkStatus.text}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Status
          </label>
          <select
            name="status"
            value={fromData.status}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          >
            <option value="Running">Running</option>
            <option value="Stopped">Stopped</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Error">Error</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Throughput
          </label>
          <input
            type="number"
            name="throughput"
            value={fromData.throughput}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Operator
          </label>
          <input
            type="text"
            name="operator"
            value={fromData.operator}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Message
          </label>
          <input
            type="text"
            name="message"
            value={fromData.message}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "Transmitting..." : "Send Data"}
        </button>
      </form>

      <div
        style={{
          flex: 1,
          background: "#1c2538",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <h2>Live JSON Payload Preview</h2>
        <pre
          style={{ color: "#34d399", fontSize: "14px", whiteSpace: "pre-wrap" }}
        >
          {JSON.stringify(currentPayloadPreview, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
