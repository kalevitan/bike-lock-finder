'use client';

import { useRouter } from "next/navigation";
import React from "react";
import classes from "./modal.module.css";

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
        <div className="modal-header flex justify-between">
          <h2 className="font-bold text-black">{title}</h2>
        </div>
        <div className={classes.modal_body}>{children}</div>
      </dialog>
    </>
  );

};

export default Modal;