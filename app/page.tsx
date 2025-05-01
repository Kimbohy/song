"use client";

import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Music Analytics App</h1>
        <p className="text-lg text-gray-600">
          We're starting from scratch! Let's build your music analytics
          dashboard.
        </p>
      </div>
    </div>
  );
}
