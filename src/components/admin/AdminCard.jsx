export default function AdminCard({ children, className = "" }) {
  return (
    <div
      style={{
        border: "2px solid #999",   // visible grey outline
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        overflow: "visible",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
