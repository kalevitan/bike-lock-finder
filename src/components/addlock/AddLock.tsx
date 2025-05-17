'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getLocation } from '@/utils/locationutils';
import { useMarkerContext } from '@/contexts/MarkerProvider';
import { MarkerProps } from '@/interfaces/markers';
import { Locate, UserPen, ImagePlus, MessageCircleWarning, Save, X } from 'lucide-react';
import FormField from './FormField';
import SearchForm from '@/components/searchform/SearchForm';
import useSubmitForm from '@/app/hooks/useSubmitForm';
import { uploadImage } from '@/lib/storage';
import { useModal } from '@/contexts/ModalProvider';
import Rating from './Rating';

interface AddLockProps {
  pointData?: MarkerProps | null;
  formMode?: 'add' | 'edit';
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
    title: pointData?.title || '',
    latitude: pointData?.latitude || '',
    longitude: pointData?.longitude || '',
    description: pointData?.description || '',
    rating: pointData?.rating || 0,
    file: pointData?.file || null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fileUrl, setFileUrl] = useState<string | null>(typeof pointData?.file === 'string' ? pointData.file : null);
  const [expandGeometry, setExpandGeometry] = useState(!pointData);
  const [noChange, setNoChange] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [notCustomLocation, setNotCustomLocation] = useState(true);

  const { setMarkers } = useMarkerContext();
  const { closeModal } = useModal();

  // Check if form data has changed from initial values
  useEffect(() => {
    console.log('Comparing form data:', { initialFormData, formData });

    // If we're in edit mode, check for actual changes
    if (formMode === 'edit') {
      const hasChanges = Object.keys(initialFormData).some(
        key => {
          const initialValue = initialFormData[key as keyof FormData];
          const currentValue = formData[key as keyof FormData];

          // Skip file field comparison if both are null
          if (key === 'file' && !initialValue && !currentValue) {
            return false;
          }

          // Convert numeric fields to numbers for comparison
          if (key === 'rating') {
            const initialNum = Number(initialValue);
            const currentNum = Number(currentValue);
            const hasChanged = initialNum !== currentNum;
            if (hasChanged) {
              console.log('Rating changed:', { initialNum, currentNum });
            }
            return hasChanged;
          }

          // For all other fields, compare values
          const hasChanged = initialValue !== currentValue;
          if (hasChanged) {
            console.log('Field changed:', { key, initialValue, currentValue });
          }
          return hasChanged;
        }
      );
      console.log('Form changes detected:', hasChanges);
      setNoChange(!hasChanges);
      return;
    }

    // For non-edit mode, always allow saving
    setNoChange(false);
  }, [formData, initialFormData, formMode]);

  const { handleSubmit: submitForm, isSubmitting, error, success } = useSubmitForm({
    pointData,
    setMarkers,
    closeModal,
    formData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadImage(file);
      setFormData({
        ...formData,
        file,
      });
      setFileUrl(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      setValidationError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const lat = place.geometry.location?.lat() ?? '';
    const lng = place.geometry.location?.lng() ?? '';

    setFormData((prev) => ({
      ...prev,
      title: place.name ?? '',
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    setSearchInput(place.name ?? '');
    setExpandGeometry(true);
  };

  const handleExpandGeometry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExpandGeometry(!expandGeometry);
  }

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
        console.error('Error getting location:', error);
      });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setValidationError('Title is required');
      return false;
    }
    if (!formData.latitude || !formData.longitude) {
      setValidationError('Location coordinates are required');
      return false;
    }
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
    if (formMode === 'edit') {
      handleExpandGeometry(e);
    } else {
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="add-point">
      <form method="post" className="space-y-4 text-black" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required={true}
            disabled={formMode == 'edit' && !expandGeometry}
          />

          {expandGeometry && (
          <div className="flex flex-col text-left">
            <label htmlFor="search" className="mb-2">Location<span className="text-red-500">*</span></label>
            <div className="grid grid-cols-[3fr_50px] gap-4 items-center">
              <SearchForm
                onSearch={handleOnSearch}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onRecenter={() => {}}
                shouldFocus={true}
              />
              <div className="text-left">
                <button onClick={locateMe} className="button button--icon flex gap-1">
                  <Locate color="white" />
                </button>
                <span className="sr-only">Locate me</span>
              </div>
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
          {isUploading && (
            <div className="text-sm text-gray-500">Uploading image...</div>
          )}
          {fileUrl ? (
            <div className={`relative mt-2 ${expandGeometry ? 'cursor-pointer hover:opacity-70 transition-opacity duration-300' : 'cursor-not-allowed'}`}>
              {fileUrl.startsWith('http') ? (
                <Image
                  src={fileUrl}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="w-full object-contain rounded-md border border-[#6b7280]"
                  onClick={() => {
                    if (expandGeometry) {
                      document.getElementById('file-image')?.click();
                    }
                  }}
                />
              ) : (
                <div className="text-red-500">Invalid image URL</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col text-left">
              <label htmlFor="file-image" className="mb-2">Image</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => document.getElementById('file-image')?.click()}
                  className="w-full p-8 border border-[#6b7280] rounded-md flex items-center justify-center"
                  disabled={formMode === 'edit' && !expandGeometry}
                >
                  <ImagePlus />
                </button>
              </div>
            </div>
          )}
          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required={false}
            disabled={formMode == 'edit' && !expandGeometry}
          />
          <Rating rating={formData.rating} onChange={handleRatingChange} disabled={formMode == 'edit' && !expandGeometry} />
        </div>

        {validationError && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md" role="alert">
            {validationError}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm p-2 bg-green-50 rounded-md" role="alert">
            {success}
          </div>
        )}

        <div className="actions flex flex-row justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="button button--secondary mt-4 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button mt-4 text-white"
            disabled={isSubmitting || (formMode !== 'edit' && noChange)}
            onClick={handleFormSubmit}
          >
            {isSubmitting ? 'Saving...' : (formMode === 'edit' ? (noChange ? 'Edit' : 'Save') : 'Save')}
          </button>
        </div>
        <div className="report-issue text-sm">
          <a href="https://github.com/kalevitan/bike-lock-finder/issues" className="flex items-center justify-end gap-1 text-gray-500" target="_blank"><MessageCircleWarning size={15}/><span>Report an issue</span></a>
        </div>
      </form>
    </div>
  );
};