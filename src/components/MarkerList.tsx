import { useState } from "react";
import { Marker } from "./Marker";
import Modal from "./modal/Modal";
import { AddPoint } from "./AddPoint";

export const MarkerList = () => {
  const [name, setName] = useState('Test Name');
  const [lat, setLat] = useState('35.597042');
  const [lon, setLon] = useState('-82.555625');
  const [description, setDescription] = useState('Test Description');
  const [showModal, setShowModal] = useState(false);

  function onNameChangeHandler(event) {
    setName(event?.target.value)
  }
  function onLatChangeHandler(event) {
    setLat(event?.target.value)
  }
  function onLonChangeHandler(event) {
    setLon(event?.target.value)
  }
  function onDescriptionChangeHandler(event) {
    setDescription(event?.target.value)
  }

  return (
    <>
      <button className="btn" onClick={() => setShowModal(true)}>Add Lock Location</button>
      {showModal &&
        <Modal onClose={() => setShowModal(false)} title="Add Lock Location Details">
          <AddPoint
            onNameChange={onNameChangeHandler}
            onLatChange={onLatChangeHandler}
            onLonChange={onLonChangeHandler}
            onDescriptionChange={onDescriptionChangeHandler}
          />
        </Modal>
      }

      <Marker name={name} lat={lat} lon={lon} description={description}/>
    </>
  );
}
