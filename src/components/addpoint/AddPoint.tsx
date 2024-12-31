'use client';

import React, { use, useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import { getLocation } from '@/src/utils/locationutils';
import { useMarkerContext } from '@/src/context/MarkerContext';
import { MarkerProps } from '@/src/interfaces/markers';
import { Locate } from 'lucide-react';
import FormField from './FormField';
import Rating from './Rating';
import xss from 'xss';

interface AddPointProps {
  closeModal: () => void;
  pointData?: MarkerProps | null;
}

export const AddPoint: React.FC<AddPointProps> = ({ closeModal, pointData }) => {
  const [formData, setFormData] = useState({
    title: pointData?.title || '',
    latitude: pointData?.latitude || '',
    longitude: pointData?.longitude || '',
    description: pointData?.description || '',
    rating: pointData?.rating || 0,
  });

  const { setMarkers } = useMarkerContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rating = Number(e.target.value);
    setFormData({
      ...formData,
      rating,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("Form submitted successfully!");
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
      console.error("Error submitting form.");
    }
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
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Latitude"
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required={true}
              />
              <FormField
                label="Longitude"
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required={true}
              />
            </div>
            <div className="text-left"><button onClick={locateMe} className="button button--link flex gap-1">
              <span><Locate /></span>Locate me...</button></div>
            <FormField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={true}
            />
            <Rating rating={formData.rating} onChange={handleRatingChange} />
          </div>
          <div className="actions flex flex-row justify-end gap-2">
            <button type="button" onClick={closeModal} className="button mt-4 text-white">Cancel</button>
            <button type="submit" className="button mt-4 text-white">{pointData ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddPoint;