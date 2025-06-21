"use client";

// import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import classes from "./modal.module.css";
import { X } from "lucide-react";
import { ModalProps } from "@/interfaces/modal";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

export function Modal({ title, children, closeModal, isOpen }: ModalProps) {
  // const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const closeHandler = () => {
    closeModal();
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    // If dragged down more than 200px, close the modal
    if (info.offset.y > 200) {
      closeModal();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
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
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              exit: { duration: 0.2, ease: "easeInOut" },
            }}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-2 -mt-2 mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

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
