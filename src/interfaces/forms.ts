export interface FormFieldProps {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea' | 'file' | 'number';
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}