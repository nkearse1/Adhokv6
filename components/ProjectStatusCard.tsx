'use client';

interface Props {
  status?: string;
}

export default function ProjectStatusCard({ status }: Props) {
  return (
    <div className="border rounded p-4 bg-gray-50 mb-4 text-sm">
      <span className="font-semibold">Status:</span> {status || 'Pending'}
    </div>
  );
}

