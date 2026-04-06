import React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const UiFormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
        {label}
      </label>
      <Input
        error={error}
        icon={icon}
        {...props}
      />
    </div>
  );
};
