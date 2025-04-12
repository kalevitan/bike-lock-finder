'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import { getLocation } from '@/utils/locationutils';
import { useMarkerContext } from '@/contexts/MarkerContext';
import { MarkerProps } from '@/interfaces/markers';
import { Locate, UserPen, MessageCircleWarning } from 'lucide-react';
import FormField from './FormField';
import Rating from './Rating';
import SearchForm from '@/components/searchform/SearchForm';
import useSubmitForm from '@/app/hooks/useSubmitForm';
import { uploadImage } from '@/lib/storage';

interface AddLockProps {
  closeModal: () => void;
  pointData?: MarkerProps | null;
}

interface FormData {
  title: string;
  latitude: string;
  longitude: string;
  description: string;
  rating: number;
  file: File | string | null;
}

export const AddLock: React.FC<AddLockProps> = ({ closeModal, pointData }) => {
  const initialFormData: FormData = {
    title: pointData?.title || '',
    latitude: pointData?.latitude || '',
    longitude: pointData?.longitude || '',
    description: pointData?.description || '',
    rating: pointData?.rating || 0,
    file: null,
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fileUrl, setFileUrl] = useState<string | null>(typeof pointData?.file === 'string' ? pointData.file : null);
  const [expandGeometry, setExpandGeometry] = useState(!pointData);
  const [noChange, setNoChange] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setMarkers } = useMarkerContext();

  // Check if form data has changed from initial values
  useEffect(() => {
    const hasChanges = Object.keys(initialFormData).some(
      key => initialFormData[key as keyof FormData] !== formData[key as keyof FormData]
    ) || fileUrl !== (pointData?.file || '');
    setNoChange(!hasChanges);
  }, [formData, fileUrl]);

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

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rating = Number(e.target.value);
    setFormData({
      ...formData,
      rating,
    });
  }

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

    setExpandGeometry(false);
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

  return (
    <Modal title="Add Lock Location Details" closeModal={closeModal}>
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
              hidden={expandGeometry}
            />
            <div className="flex flex-col text-left">
              <label htmlFor="search" className="mb-2">Location<span className="text-red-500">*</span></label>
              <div className="grid grid-cols-[3fr_1fr] gap-4">
                <SearchForm onSearch={handleOnSearch}/>
                <button className="button text-white flex gap-1" onClick={handleExpandGeometry}>
                  <UserPen/><span className="">{expandGeometry ? 'Edit' : 'Collapse'}</span>
                </button>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-4 ${expandGeometry ? 'hidden' : 'visible'}`}>
              <FormField
                label="Latitude"
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required={true}
                hidden={expandGeometry}
              />
              <FormField
                label="Longitude"
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required={true}
                hidden={expandGeometry}
              />
            </div>
            <div className="text-left">
              <button onClick={locateMe} className="button button--link flex gap-1">
              <span><Locate /></span>Locate me...</button>
            </div>
            <FormField
              label="Image"
              type="file"
              name="file"
              onFileChange={handleFileChange}
              required={false}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="text-sm text-gray-500">Uploading image...</div>
            )}
            <FormField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={false}
            />
            <Rating rating={formData.rating} onChange={handleRatingChange} />
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
              disabled={isSubmitting || noChange}
            >
              {isSubmitting ? 'Saving...' : (pointData ? 'Update' : 'Submit')}
            </button>
          </div>
          <div className="report-issue text-sm">
            <a href="" className="flex items-center justify-end gap-1 text-gray-500" target="_blank"><MessageCircleWarning size={15}/><span>Report an issue</span></a>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddLock;