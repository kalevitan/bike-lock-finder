import { useState, useCallback } from 'react';
import { MarkerProps } from '@/interfaces/markers';
import xss from 'xss';
import { useMarkerContext } from '@/contexts/MarkerProvider';
import { uploadImage } from '@/lib/storage';

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
    file: File | string | null;
  };
}

const useSubmitForm = ({ pointData, setMarkers, closeModal, formData }: UseSubmitFormProps) => {
  const { refreshMarkers } = useMarkerContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        const url = '/api/markers';
        const method = pointData?.id ? 'PUT' : 'POST';

        // Upload file first if it exists
        let downloadURL = null;
        if (formData.file instanceof File) {
          downloadURL = await uploadImage(formData.file);
        } else if (typeof formData.file === 'string') {
          downloadURL = formData.file;
        }

        const sanitizedData = Object.fromEntries(
          Object.entries({
            ...formData,
            file: downloadURL || null,
          }).map(([key, value]) => [key, xss(String(value))])
        );

        const response = await fetch(url, {
          method,
          body: JSON.stringify({
            ...sanitizedData,
            id: pointData?.id,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to ${pointData?.id ? 'update' : 'create'} marker`);
        }

        const responseData = await response.json();
        const newMarkerId = responseData.id;
        if (!pointData?.id) {
          setMarkers((prev: MarkerProps[]) => [
            ...prev,
            { ...formData, id: newMarkerId, file: downloadURL || null } as MarkerProps,
          ]);
        } else {
          setMarkers((prev: MarkerProps[]) => {
            return prev.map((m) =>
              m.id === pointData.id ? { ...m, ...formData, file: downloadURL || null } as MarkerProps : m
            );
          });
        }

        await refreshMarkers();
        setSuccess('Location saved successfully!');
        closeModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
    [pointData, setMarkers, closeModal, formData, refreshMarkers]
  );

  return { handleSubmit, isSubmitting, error, success };
};

export default useSubmitForm;