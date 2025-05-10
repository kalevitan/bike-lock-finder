'use client';

import { useRouter } from "next/navigation";
import React from "react";
import classes from "./modal.module.css";
import { X } from "lucide-react";

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
      <div className={classes.backdrop} onClick={closeHandler}></div>
      <dialog open className={classes.modal} aria-modal="true">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="font-bold text-black">{title}</h2>
          <button className="flex gap-1" onClick={closeHandler}>
            <X className="w-6 h-6" color="black" />
          </button>
        </div>
        <div className={classes.modal_body}>{children}</div>
      </dialog>
    </>
  );

};

export default Modal;