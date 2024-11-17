import { useNavigate } from "react-router-dom";
import React from "react";
import "./modal.css";

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate('..');
  };

  return (
    <>
      <div className="backdrop" onClick={closeHandler}></div>
      <dialog open className="modal">
        <div className="modal-header flex justify-between">
          <h2 className="font-bold text-black">{title}</h2>
        </div>
        <div className="modal-body">{children}</div>
      </dialog>
    </>
  );

};

export default Modal;