import "./app.css";

function LoginForm({ loginData, onChange, onLogin }) {
  return (
    <form onSubmit={onLogin} className="auth-form">
      <h2>Operator Login</h2>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Username
        </label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
