'use client';
export default function LeaveReviewButton() {
  return (
    <button
      onClick={() => alert('Review submitted! (stub)')}
      className="bg-gray-100 px-4 py-2 rounded border"
    >
      Leave Review
    </button>
  );
}
