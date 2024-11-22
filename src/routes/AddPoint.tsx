import React from 'react';
import { Link, Form, redirect } from 'react-router-dom';
import Modal from '../components/modal/Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getLocation } from '../utils/locationutils';

export const AddPoint: React.FC = () => {

  const locateMe = (e) => {
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
    <Modal title="Add Lock Location Details">
      <div className="add-point">
        <Form method="post" className="space-y-4 text-black">
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
            <Link to="/" className="button mt-4 text-white">Cancel</Link>
            <button type="submit" className="button mt-4 text-white">Save</button>
          </div>
        </Form>
      </div>
    </Modal>

  );
};

export default AddPoint;

export const action = async ({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  console.log(JSON.stringify(data));

  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      title: data.title,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }

  return redirect('/');
}