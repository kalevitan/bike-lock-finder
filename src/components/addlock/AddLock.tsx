'use client';

import React, { useState } from 'react';
import Modal from '../modal/Modal';
import { getLocation } from '@/utils/locationutils';
import { useMarkerContext } from '@/context/MarkerContext';
import { MarkerProps } from '@/interfaces/markers';
import { Locate, UserPen, MessageCircleWarning } from 'lucide-react';
import FormField from './FormField';
import Rating from './Rating';
import SearchForm from '@/components/searchform/SearchForm';
import useSubmitForm from '@/app/hooks/useSubmitForm';

interface AddLockProps {
  closeModal: () => void;
  pointData?: MarkerProps | null;
}

export const AddLock: React.FC<AddLockProps> = ({ closeModal, pointData }) => {
  const [formData, setFormData] = useState({
    title: pointData?.title || '',
    latitude: pointData?.latitude || '',
    longitude: pointData?.longitude || '',
    description: pointData?.description || '',
    rating: pointData?.rating || 0,
  });
  const [expandGeometry, setExpandGeometry] = useState(pointData ? false : true);
  const [noChange, setNoChange] = useState(true);
  console.log(noChange);

  const { setMarkers } = useMarkerContext();

  const { handleSubmit, isSubmitting } = useSubmitForm({
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
    setNoChange(false);
  }

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
    setNoChange(false);
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

  return (
    <Modal title="Add Lock Location Details" closeModal={closeModal}>
      <div className="add-point mt-4 mb-4">
        <form method="post" className="space-y-4 text-black" onSubmit={handleSubmit}>
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
              <label htmlFor="search" className="my-2">Location<span className="text-red-500">*</span></label>
              <div className="flex flex-row gap-2">
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
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={false}
            />
            <Rating rating={formData.rating} onChange={handleRatingChange} />
          </div>
          <div className="actions flex flex-row justify-end gap-2">
            <button type="button" onClick={closeModal} className="button button--secondary mt-4 text-white">Cancel</button>
            <button type="submit" className="button mt-4 text-white" disabled={isSubmitting || noChange}>{pointData ? 'Update' : 'Submit'}</button>
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