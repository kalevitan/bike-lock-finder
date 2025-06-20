import { useState, useCallback } from "react";
import { MarkerProps } from "@/interfaces/markers";
import xss from "xss";
import { useMarkerContext } from "@/contexts/MarkerProvider";
import { uploadAndCompressImage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthProvider";
import { incrementUserContributions } from "@/lib/users";

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

const useSubmitForm = ({
  pointData,
  setMarkers,
  closeModal,
  formData,
}: UseSubmitFormProps) => {
  const { refreshMarkers, addOptimisticMarker } = useMarkerContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isAuthLoading) {
        setError(
          "Authentication is initializing. Please wait a moment and try again."
        );
        return;
      }
      if (!user) {
        setError("You must be logged in to save a location.");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        const url = "/api/markers";
        const method = pointData?.id ? "PUT" : "POST";

        let downloadURL = null;
        if (formData.file instanceof File) {
          downloadURL = await uploadAndCompressImage(formData.file, "images");
        } else if (typeof formData.file === "string") {
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
            author: method === "POST" ? user?.uid : pointData?.author,
            updatedBy: user?.uid,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to ${pointData?.id ? "update" : "create"} marker`
          );
        }

        if (method === "POST" && user) {
          await incrementUserContributions(user.uid);
        }

        const responseData = await response.json();
        const newMarkerId = responseData.id;
        if (!pointData?.id) {
          setMarkers((prev: MarkerProps[]) => [
            ...prev,
            {
              ...formData,
              id: newMarkerId,
              file: downloadURL || null,
            } as MarkerProps,
          ]);
        } else {
          setMarkers((prev: MarkerProps[]) => {
            return prev.map((m) =>
              m.id === pointData.id
                ? ({
                    ...m,
                    ...formData,
                    file: downloadURL || null,
                  } as MarkerProps)
                : m
            );
          });
        }

        if (method === "POST") {
          const newMarker = {
            ...formData,
            id: responseData.id,
            file: downloadURL || null,
            author: user?.uid,
            isOpen: false,
            onClick: () => {},
            onClose: () => {},
            onEditPoint: () => {},
          } as MarkerProps;
          addOptimisticMarker(newMarker);
        }

        setSuccess("Location saved successfully!");
        closeModal();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      pointData,
      setMarkers,
      closeModal,
      formData,
      user,
      addOptimisticMarker,
      isAuthLoading,
    ]
  );

  return { handleSubmit, isSubmitting, error, success, isAuthLoading };
};

export default useSubmitForm;
