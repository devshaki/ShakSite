import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormConfig, FormSubmitEvent, FormCancelEvent, FormField } from '../../models/form-builder.models';

/**
 * Generic Form Builder Component
 * 
 * A reusable, configuration-driven form component that supports:
 * - Multiple sections with icons and labels
 * - Various field types (text, textarea, select, date, number, etc.)
 * - Validation and required fields
 * - Custom theming per form
 * - Event-driven architecture
 * 
 * Usage:
 * <app-form-builder 
 *   [config]="formConfig"
 *   (formSubmit)="handleSubmit($event)"
 *   (formCancel)="handleCancel($event)"
 * />
 */
@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-builder.html',
  styleUrl: './form-builder.scss'
})
export class FormBuilder {
  // Input: Form configuration
  config = input.required<FormConfig>();
  
  // Outputs: Form events
  formSubmit = output<FormSubmitEvent>();
  formCancel = output<FormCancelEvent>();
  
  // Internal state: Form data
  formData = signal<Record<string, any>>({});
  
  constructor() {
    // Initialize form data when config changes
    effect(() => {
      const cfg = this.config();
      const initialData: Record<string, any> = {};
      
      cfg.sections.forEach(section => {
        section.fields.forEach(field => {
          initialData[field.name] = field.value ?? '';
        });
      });
      
      this.formData.set(initialData);
    });
  }
  
  /**
   * Update form field value
   */
  updateField(fieldName: string, value: any): void {
    this.formData.update(data => ({
      ...data,
      [fieldName]: value
    }));
  }
  
  /**
   * Check if a field is valid
   */
  isFieldValid(field: FormField): boolean {
    const value = this.formData()[field.name];
    
    if (field.required) {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value != null && value !== '';
    }
    
    return true;
  }
  
  /**
   * Check if entire form is valid
   */
  isFormValid(): boolean {
    const cfg = this.config();
    
    return cfg.sections.every(section =>
      section.fields.every(field => this.isFieldValid(field))
    );
  }
  
  /**
   * Handle form submission
   */
  handleSubmit(): void {
    if (this.isFormValid()) {
      this.formSubmit.emit({
        data: { ...this.formData() }
      });
    }
  }
  
  /**
   * Handle form cancellation
   */
  handleCancel(): void {
    this.formCancel.emit({});
  }
  
  /**
   * Reset form to initial values
   */
  resetForm(): void {
    const cfg = this.config();
    const resetData: Record<string, any> = {};
    
    cfg.sections.forEach(section => {
      section.fields.forEach(field => {
        resetData[field.name] = field.value ?? '';
      });
    });
    
    this.formData.set(resetData);
  }
  
  /**
   * Get theme-specific CSS class
   */
  getThemeClass(): string {
    return `theme-${this.config().colorTheme}`;
  }
  
  /**
   * Get field value for binding
   */
  getFieldValue(fieldName: string): any {
    return this.formData()[fieldName];
  }
}
