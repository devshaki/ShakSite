/**
 * Form Builder Models
 * Defines the configuration structure for the generic form builder component
 */

export type FormFieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email' | 'time';

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  icon?: string;
  options?: FormFieldOption[]; // For select fields
  rows?: number; // For textarea
  min?: number; // For number/date
  max?: number; // For number/date
  value?: any;
}

export interface FormSection {
  label: string;
  icon: string;
  fields: FormField[];
}

export interface FormConfig {
  title: string;
  titleIcon: string;
  colorTheme: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  sections: FormSection[];
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export interface FormSubmitEvent {
  data: Record<string, any>;
  sectionIndex?: number;
}

export interface FormCancelEvent {
  sectionIndex?: number;
}
