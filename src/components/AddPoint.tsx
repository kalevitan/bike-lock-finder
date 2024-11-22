'use client';

import React from 'react';
import Link from 'next/link';
import Modal from './modal/Modal';
import { getLocation } from '../utils/locationutils';

interface AddPointProps {
  closeModal: () => void;
}

export const AddPoint: React.FC<AddPointProps> = ({ closeModal }) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const response = await fetch("/api/marker", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("Form submitted successfully!");
    } else {
      console.error("Error submitting form.");
    }
  }

  const locateMe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    getLocation()
      .then((position) => {
        const latitude = document.getElementById('latitude') as HTMLInputElement;
        const longitude = document.getElementById('longitude') as HTMLInputElement;
        if (latitude && longitude) {
          latitude.value = position.lat.toString();
          longitude.value = position.lng.toString();
        }
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
                className="p-2 border rounded"
              ></textarea>
            </div>
          </div>
          <div className="actions flex flex-row justify-end gap-2">
            <button onClick={closeModal} className="button mt-4 text-white">Cancel</button>
            <button type="submit" className="button mt-4 text-white">Save</button>
          </div>
        </form>
      </div>
    </Modal>

  );
};

export default AddPoint;