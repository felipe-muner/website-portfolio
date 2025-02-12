'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface DeleteSessionButtonProps {
  sessionId: number;
}

export default function DeleteSessionButton({ sessionId }: DeleteSessionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/sessions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });
      if (response.ok) {
        router.refresh(); // Refresh the page to update the sessions list.
      } else {
        console.error('Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
    setIsDeleting(false);
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="p-1">
      <X className="w-4 h-4 text-red-500" />
    </button>
  );
}
