'use client';

import React, { use, useEffect, useState } from 'react';
import Modal from './modal/Modal';
import { getLocation } from '@/src/utils/locationutils';
import { useMarkerContext } from '@/src/context/MarkerContext';
import { MarkerProps } from '@/src/types/types';

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
  });

  const { markers, setMarkers } = useMarkerContext();

  // useEffect(() => {
  //   if (pointData) {
  //     setFormData({
  //       title: pointData.title,
  //       latitude: pointData.latitude,
  //       longitude: pointData.longitude,
  //       description: pointData.description,
  //     });
  //   }
  // }, [pointData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = '/api/markers';
    const method = pointData?.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: JSON.stringify({
        ...formData,
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
          console.log('Previous Markers:', prev);
          console.log('Updating Marker with ID:', pointData?.id);
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
      <div className="add-point">
        <form method="post" className="space-y-4 text-black" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col text-left">
              <label htmlFor="name" className="mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col text-left">
                <label htmlFor="lat" className="mb-2">Latitude</label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col text-left">
                <label htmlFor="lon" className="mb-2">Longitude</label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="text-left"><button onClick={locateMe} className="button button--link">Locate me...</button></div>
            <div className="flex flex-col text-left">
              <label htmlFor="description" className="mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="p-2 border rounded"
              ></textarea>
            </div>
          </div>
          <div className="actions flex flex-row justify-end gap-2">
            <button onClick={closeModal} className="button mt-4 text-white">Cancel</button>
            <button type="submit" className="button mt-4 text-white">{pointData ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddPoint;