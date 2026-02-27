"use client";

// This page intentionally crashes to demonstrate Error Boundaries
// Remove this file after recording your video!

export default function TestCrash() {
  // Intentionally throw an error to demonstrate Error Boundary
  throw new Error("💣 Boom! Site crashed for demo!");
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Test Crash Page</h1>
      <p>You should not see this because the page crashes before rendering.</p>
    </div>
  );
}
