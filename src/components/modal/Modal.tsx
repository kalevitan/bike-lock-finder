"use client";

// import { useRouter } from "next/navigation";
import React from "react";
import classes from "./modal.module.css";
import { X } from "lucide-react";
import { ModalProps } from "@/interfaces/modal";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ title, children, closeModal, isOpen }: ModalProps) {
  // const router = useRouter();

  const closeHandler = () => {
    closeModal();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className={classes.backdrop}
            onClick={closeHandler}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.dialog
            open
            className={classes.modal}
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              exit: { duration: 0.2, ease: "easeInOut" },
            }}
          >
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="font-bold text-black">{title}</h2>
              <button className="flex gap-1" onClick={closeHandler}>
                <X className="w-6 h-6" color="black" />
              </button>
            </div>
            <div className={classes.modal_body}>{children}</div>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
