import React from "react";

export default function AdminSection({ title, children, className = "" }) {
  return (
    <section className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
