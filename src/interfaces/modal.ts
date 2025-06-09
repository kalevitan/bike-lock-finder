import { ReactNode } from 'react';

export interface ModalContextProps {
  isOpen: boolean;
  content: ReactNode | null;
  title: string;
  openModal: (content: ReactNode, title: string) => void;
  closeModal: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  closeModal: () => void;
}