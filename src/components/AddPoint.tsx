'use client';

import React, { use, useEffect, useState } from 'react';
import Modal from './modal/Modal';
import { getLocation } from '@/src/utils/locationutils';
import { useMarkerContext } from '@/src/context/MarkerContext';
import { MarkerProps } from '@/src/interfaces/markers';

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
            <div className="rating flex flex-col text-left">
              <label className="mb-2">Rating</label>
              <div className="flex">
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str0"
                  value="0"
                  checked={formData.rating === 0}
                  onChange={handleRatingChange}
                />
                <label className="star-label !hidden" htmlFor="str0">
                  None chosen
                </label>
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str1"
                  value="1"
                  checked={formData.rating === 1}
                  onChange={handleRatingChange}
                />
                <label className="star-label" htmlFor="str1">
                  <div className="star-shape"></div>
                </label>
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str2"
                  value="2"
                  checked={formData.rating === 2}
                  onChange={handleRatingChange}
                />
                <label className="star-label" htmlFor="str2">
                  <div className="star-shape"></div>
                </label>
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str3"
                  value="3"
                  checked={formData.rating === 3}
                  onChange={handleRatingChange}
                />
                <label className="star-label" htmlFor="str3">
                  <div className="star-shape"></div>
                </label>
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str4"
                  value="4"
                  checked={formData.rating === 4}
                  onChange={handleRatingChange}
                />
                <label className="star-label" htmlFor="str4">
                  <div className="star-shape"></div>
                </label>
                <input
                  className="star"
                  type="radio"
                  name="rating"
                  id="str5"
                  value="5"
                  checked={formData.rating === 5}
                  onChange={handleRatingChange}
                />
                <label className="star-label" htmlFor="str5">
                  <div className="star-shape"></div>
                </label>
              </div>
            </div>
            {/* <div className="flex flex-col text-left">
              <label htmlFor="image" className="hidden mb-2">Upload Image</label>
              <input
                type="file"
                id="image"
                name="image"
                className="hidden" />
                <button type="button" className="button text-white">Upload Image</button>
            </div> */}
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