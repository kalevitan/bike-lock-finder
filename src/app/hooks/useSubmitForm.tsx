import { useState, useCallback } from 'react';
import { MarkerProps } from '@/interfaces/markers';
import xss from 'xss';

interface UseSubmitFormProps {
  pointData?: MarkerProps | null;
  setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>;
  closeModal: () => void;
  formData: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
    rating: number;
  };
}

const useSubmitForm = ({ pointData, setMarkers, closeModal, formData }: UseSubmitFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      const url = '/api/markers';
      const method = pointData?.id ? 'PUT' : 'POST';

      // Sanitize form data
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, xss(String(value))])
      );

      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          ...sanitizedData,
          id: pointData?.id,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        const responseData = await response.json();

        // Firebase typically returns the generated ID
        const newMarkerId = responseData.id;

        if (!pointData?.id) {
          // Add new marker with the ID from Firebase
          setMarkers((prev: MarkerProps[]) => [
            ...prev,
            { ...formData, id: newMarkerId },
          ]);
        } else {
          // Update existing marker
          setMarkers((prev: MarkerProps[]) => {
            const updatedMarkers = prev.map((m) =>
              m.id === pointData.id ? { ...m, ...formData } : m
            );
            console.log('Updated Markers:', updatedMarkers);
            return updatedMarkers;
          });
        }
        closeModal();
      } else {
        console.error('Error submitting form.');
      }

      setIsSubmitting(false);
    },
    [pointData, setMarkers, closeModal, formData]
  );

  return { handleSubmit, isSubmitting };
};

export default useSubmitForm;