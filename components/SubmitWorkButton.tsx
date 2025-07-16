'use client';
export default function SubmitWorkButton() {
  return (
    <button
      onClick={() => alert('Work submitted! (stub)')}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Submit Work
    </button>
  );
}
