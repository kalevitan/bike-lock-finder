"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ModalContextProps } from "@/interfaces/modal";
import Modal from "@/components/modal/Modal";

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState("");

  const openModal = (content: ReactNode, title: string) => {
    setContent(content);
    setTitle(title);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
    setTitle("");
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, content, title, openModal, closeModal }}
    >
      {children}
      {isOpen && content && (
        <Modal isOpen={isOpen} title={title} closeModal={closeModal}>
          {content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
