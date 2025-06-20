"use client";

// import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import classes from "./modal.module.css";
import { X } from "lucide-react";
import { ModalProps } from "@/interfaces/modal";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ title, children, closeModal, isOpen }: ModalProps) {
  // const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);

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
            ref={modalRef}
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
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-[var(--primary-gray)]">
                {title}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={closeHandler}
                >
                  <X className="w-5 h-5 text-[var(--primary-gray)]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className={classes.modal_body}>{children}</div>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
