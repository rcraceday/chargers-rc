// src/components/ui/AdminCard.jsx

export default function AdminCard({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-md 
        border-[1.5px] border-gray-400 
        shadow-sm 
        shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4)]
        bg-gradient-to-b from-white to-gray-50
        ${className}
      `}
    >
      {children}
    </div>
  );
}
