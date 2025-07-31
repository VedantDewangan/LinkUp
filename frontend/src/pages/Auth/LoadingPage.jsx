import "./Auth.css";

export default function LoadingPage() {
  return (
    <div
      className="auth-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div className="loader"></div>
      <p style={{ padding: "15px" }}>Loading...</p>
    </div>
  );
}
