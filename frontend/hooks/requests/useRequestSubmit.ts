import { useState } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import { createRequest, RequestData } from '../../services/requestService';

/**
 * Hook for submitting rental requests with success feedback
 * Handles request creation, confetti animation, and navigation
 */
export function useRequestSubmit() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit a rental request with confetti celebration on success
   */
  const submitRequest = async (requestData: RequestData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Create the request
      const success = await createRequest(requestData);

      if (success) {
        // Stop loading first
        setSubmitting(false);

        // Small delay to let user see the button return to normal
        setTimeout(() => {
          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 100);

        // Wait for confetti before redirect
        setTimeout(() => {
          router.push('/requests?tab=sent');
        }, 1600);

        return true;
      }

      return false;
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err instanceof Error ? err.message : 'Failed to send request');
      setSubmitting(false);
      return false;
    }
  };

  return {
    submitRequest,
    submitting,
    error,
  };
}

