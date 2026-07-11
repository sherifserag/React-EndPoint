import "./app.css";

function ProductionForm({ formData, onChange, onSubmit, isSubmitting }) {
  const currentPayloadPreview = [
    {
      ...formData,
      timestamp: new Date().toISOString(),
    },
  ];

  return (
    <div className="grid-layout">
      <form onSubmit={onSubmit} className="panel">
        <h2>New Production Item</h2>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="form-control"
            required
          >
            <option value="Running">Running</option>
            <option value="Stopped">Stopped</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Error">Error</option>
          </select>
        </div>

        <div className="form-group">
          <label>Throughput</label>
          <input
            type="number"
            name="throughput"
            value={formData.throughput}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Operator</label>
          <input
            type="text"
            name="operator"
            value={formData.operator}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Transmitting..." : "Send Data"}
        </button>
      </form>

      <div className="panel">
        <h2>Live JSON Payload Preview</h2>
        <pre className="json-preview">
          {JSON.stringify(currentPayloadPreview, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ProductionForm;
