'use client';

import { useRouter } from "next/navigation";
import React from "react";
import "./modal.css";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, closeModal }) => {
  const router = useRouter();

  const closeHandler = () => {
    closeModal();
    router.push('..');
  };

  return (
    <>
      <div className="backdrop" onClick={closeHandler}></div>
      <dialog open className="modal" aria-modal="true">
        <div className="modal-header flex justify-between">
          <h2 className="font-bold text-black">{title}</h2>
        </div>
        <div className="modal-body">{children}</div>
      </dialog>
    </>
  );

};

export default Modal;