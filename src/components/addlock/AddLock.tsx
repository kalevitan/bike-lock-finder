"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getLocation } from "@/utils/locationutils";
import { useMarkerContext } from "@/contexts/MarkerProvider";
import { MarkerProps } from "@/interfaces/markers";
import { Locate, ImagePlus, MessageCircleWarning } from "lucide-react";
import FormField from "./FormField";
import SearchForm from "@/components/searchform/SearchForm";
import useSubmitForm from "@/app/hooks/useSubmitForm";
import { uploadAndCompressImage } from "@/lib/storage";
import { useModal } from "@/contexts/ModalProvider";
import Rating from "./Rating";

interface AddLockProps {
  pointData?: MarkerProps | null;
  formMode?: "add" | "edit";
}

interface FormData {
  title: string;
  latitude: string;
  longitude: string;
  description: string;
  rating: number;
  file: File | string | null;
}

export default function AddLock({ pointData, formMode }: AddLockProps) {
  const initialFormData: FormData = {
    title: pointData?.title || "",
    latitude: pointData?.latitude || "",
    longitude: pointData?.longitude || "",
    description: pointData?.description || "",
    rating: pointData?.rating || 0,
    file: pointData?.file || null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fileUrl, setFileUrl] = useState<string | null>(
    typeof pointData?.file === "string" ? pointData.file : null
  );
  const [expandGeometry, setExpandGeometry] = useState(!pointData);
  const [noChange, setNoChange] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [notCustomLocation, setNotCustomLocation] = useState(true);

  const { setMarkers } = useMarkerContext();
  const { closeModal } = useModal();

  // Check if form data has changed from initial values
  useEffect(() => {
    // If we're in edit mode, check for actual changes
    if (formMode === "edit") {
      const hasChanges = Object.keys(initialFormData).some((key) => {
        const initialValue = initialFormData[key as keyof FormData];
        const currentValue = formData[key as keyof FormData];

        // Skip file field comparison if both are null
        if (key === "file" && !initialValue && !currentValue) {
          return false;
        }

        // Convert numeric fields to numbers for comparison
        if (key === "rating") {
          const initialNum = Number(initialValue);
          const currentNum = Number(currentValue);
          return initialNum !== currentNum;
        }

        // For all other fields, compare values
        return initialValue !== currentValue;
      });
      setNoChange(!hasChanges);
      return;
    }

    // For non-edit mode, always allow saving
    setNoChange(false);
  }, [formData, initialFormData, formMode]);

  const {
    handleSubmit: submitForm,
    isSubmitting,
    error,
    success,
    isAuthLoading,
  } = useSubmitForm({
    pointData,
    setMarkers,
    closeModal,
    formData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setValidationError(null);
    try {
      const downloadURL = await uploadAndCompressImage(file, "images");
      setFormData((prev) => ({
        ...prev,
        file: downloadURL,
      }));
      setFileUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      setValidationError(
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRatingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement) {
      const rating = Number(e.target.value);
      setFormData({
        ...formData,
        rating,
      });
    }
  };

  const handleOnSearch = (place: google.maps.places.PlaceResult | null) => {
    if (!place || !place.geometry) return;

    const lat = place.geometry.location?.lat() ?? "";
    const lng = place.geometry.location?.lng() ?? "";

    setFormData((prev) => ({
      ...prev,
      title: place.name ?? "",
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    setSearchInput(place.name ?? "");
    setExpandGeometry(true);
  };

  const handleExpandGeometry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExpandGeometry(!expandGeometry);
  };

  const locateMe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    getLocation()
      .then((position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.lat.toString(),
          longitude: position.lng.toString(),
        }));
        setExpandGeometry(false);
        setNotCustomLocation(false);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
      });
  };

  const validateForm = () => {
    // Sanitize and validate title
    const sanitizedTitle = formData.title.trim().replace(/[<>]/g, "");
    if (!sanitizedTitle) {
      setValidationError("Title is required");
      return false;
    }
    if (sanitizedTitle.length > 65) {
      setValidationError("Title must be less than 65 characters");
      return false;
    }

    // Validate coordinates
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setValidationError("Invalid location coordinates");
      return false;
    }

    // Sanitize and validate description
    const sanitizedDescription = formData.description
      .trim()
      .replace(/[<>]/g, "");
    if (sanitizedDescription.length > 200) {
      setValidationError("Description must be less than 200 characters");
      return false;
    }

    // Update form data with sanitized values
    setFormData((prev) => ({
      ...prev,
      title: sanitizedTitle,
      description: sanitizedDescription,
    }));

    setValidationError(null);
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await submitForm(e);
  };

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (formMode === "edit" && noChange) {
      handleExpandGeometry(e);
    } else {
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="add-point">
      <form method="post" className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-5">
          <FormField
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required={true}
            disabled={formMode == "edit" && !expandGeometry}
          />

          {expandGeometry && (
            <div className="space-y-2">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-[var(--primary-gray)]"
              >
                Location<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <div className="flex-1">
                  <SearchForm
                    onSearch={handleOnSearch}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onRecenter={() => {}}
                    shouldFocus={true}
                  />
                </div>
                <button
                  onClick={locateMe}
                  className="h-[44px] w-[44px] flex items-center justify-center rounded-xl border-2 border-[var(--steel-blue)]/30 hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)]/10 transition-all duration-200 group"
                  title="Use my current location"
                >
                  <Locate
                    size={20}
                    className="text-[var(--steel-blue)] group-hover:text-[var(--primary-purple)] transition-colors duration-200"
                  />
                  <span className="sr-only">Locate me</span>
                </button>
              </div>
            </div>
          )}

          {!notCustomLocation && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Latitude"
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required={true}
                hidden={notCustomLocation}
              />
              <FormField
                label="Longitude"
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required={true}
                hidden={notCustomLocation}
              />
            </div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <FormField
              label="Image"
              type="file"
              name="file-image"
              value={fileUrl || undefined}
              onFileChange={handleFileChange}
              required={false}
              disabled={isUploading}
              hidden={true}
            />

            {fileUrl && fileUrl.startsWith("http") ? (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border-2 border-[var(--steel-blue)]/20 shadow-lg">
                  <Image
                    src={fileUrl}
                    alt="Bike lock image"
                    width={300}
                    height={300}
                    className="w-full h-[240px] object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                    onClick={() => {
                      if (expandGeometry) {
                        document.getElementById("file-image")?.click();
                      } else {
                        window.open(fileUrl, "_blank");
                      }
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-[var(--primary-gray)]/80 flex items-center justify-center rounded-xl">
                      <div className="text-[var(--primary-white)] font-medium">
                        Uploading...
                      </div>
                    </div>
                  )}
                  {expandGeometry && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-[var(--primary-white)] text-[var(--primary-gray)] px-3 py-1 rounded-full text-sm font-medium">
                        Click to change
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--primary-gray)]">
                  Image
                </label>
                <button
                  type="button"
                  onClick={() => document.getElementById("file-image")?.click()}
                  className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
                    expandGeometry
                      ? "border-[var(--steel-blue)]/40 hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)]/5 cursor-pointer group"
                      : "border-gray-300 cursor-not-allowed bg-gray-50"
                  }`}
                  disabled={formMode === "edit" && !expandGeometry}
                >
                  <ImagePlus
                    size={32}
                    className={
                      expandGeometry
                        ? "text-[var(--steel-blue)] group-hover:text-[var(--primary-purple)] transition-colors duration-200"
                        : "text-gray-400"
                    }
                  />
                  <span
                    className={`text-sm font-medium ${
                      expandGeometry
                        ? "text-[var(--primary-gray)] group-hover:text-[var(--primary-purple)]"
                        : "text-gray-400"
                    }`}
                  >
                    {expandGeometry
                      ? "Click to add an image"
                      : "Image upload disabled"}
                  </span>
                </button>
              </div>
            )}
          </div>

          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required={false}
            disabled={formMode == "edit" && !expandGeometry}
          />

          <Rating
            rating={formData.rating}
            onChange={handleRatingChange}
            disabled={formMode == "edit" && !expandGeometry}
          />
        </div>

        {/* Error and Success Messages */}
        {validationError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-red-800 text-sm">{validationError}</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 bg-gray-100 text-[var(--primary-gray)] font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--deep-purple)] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
            disabled={
              isSubmitting || isAuthLoading || (formMode !== "edit" && noChange)
            }
            onClick={handleFormSubmit}
          >
            {isAuthLoading
              ? "Authenticating..."
              : isSubmitting
                ? "Saving..."
                : formMode === "edit"
                  ? noChange
                    ? "Edit"
                    : "Save Changes"
                  : "Add Lock"}
          </button>
        </div>

        {/* Report Issue Link */}
        <div className="pt-4 border-t border-gray-100">
          <a
            href="https://github.com/kalevitan/bike-lock-finder/issues"
            className="flex items-center justify-center gap-2 text-[var(--primary-gray)]/60 hover:text-[var(--primary-purple)] text-sm transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleWarning size={16} />
            <span>Report an issue</span>
          </a>
        </div>
      </form>
    </div>
  );
}
