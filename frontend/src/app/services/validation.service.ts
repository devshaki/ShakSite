import { Injectable } from '@angular/core';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validateRequired(value: string | null | undefined, fieldName: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { valid: false, error: `${fieldName} הוא שדה חובה` };
    }
    return { valid: true };
  }

  validateDate(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { valid: false, error: `${fieldName} הוא שדה חובה` };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { valid: false, error: `${fieldName} אינו תאריך תקין` };
    }

    return { valid: true };
  }

  validateFutureDate(value: string, fieldName: string): ValidationResult {
    const dateValidation = this.validateDate(value, fieldName);
    if (!dateValidation.valid) return dateValidation;

    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return { valid: false, error: `${fieldName} חייב להיות בעתיד` };
    }

    return { valid: true };
  }

  validateTime(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { valid: true };
    }

    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(value)) {
      return { valid: false, error: 'פורמט זמן לא תקין (HH:MM)' };
    }

    return { valid: true };
  }

  validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
    if (value && value.trim().length < minLength) {
      return { valid: false, error: `${fieldName} חייב להכיל לפחות ${minLength} תווים` };
    }
    return { valid: true };
  }

  validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    if (value && value.trim().length > maxLength) {
      return { valid: false, error: `${fieldName} חייב להכיל עד ${maxLength} תווים` };
    }
    return { valid: true };
  }

  validateFileSize(file: File, maxSizeMB: number): ValidationResult {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `גודל הקובץ חורג מ-${maxSizeMB}MB` };
    }
    return { valid: true };
  }

  validateFileType(file: File, allowedTypes: string[]): ValidationResult {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'סוג הקובץ אינו נתמך' };
    }
    return { valid: true };
  }

  validateExamForm(subject: string, date: string, time?: string, room?: string): ValidationResult {
    let result: ValidationResult;

    result = this.validateRequired(subject, 'מקצוע');
    if (!result.valid) return result;

    result = this.validateDate(date, 'תאריך');
    if (!result.valid) return result;

    if (time) {
      result = this.validateTime(time);
      if (!result.valid) return result;
    }

    if (room) {
      result = this.validateMaxLength(room, 50, 'חדר');
      if (!result.valid) return result;
    }

    return { valid: true };
  }

  validateTaskForm(title: string, dueDate: string, description?: string): ValidationResult {
    let result: ValidationResult;

    result = this.validateRequired(title, 'כותרת');
    if (!result.valid) return result;

    result = this.validateMinLength(title, 2, 'כותרת');
    if (!result.valid) return result;

    result = this.validateDate(dueDate, 'תאריך הגשה');
    if (!result.valid) return result;

    if (description) {
      result = this.validateMaxLength(description, 500, 'תיאור');
      if (!result.valid) return result;
    }

    return { valid: true };
  }

  validateQuoteForm(text: string, author?: string): ValidationResult {
    let result: ValidationResult;

    result = this.validateRequired(text, 'טקסט הציטוט');
    if (!result.valid) return result;

    result = this.validateMinLength(text, 5, 'טקסט הציטוט');
    if (!result.valid) return result;

    result = this.validateMaxLength(text, 500, 'טקסט הציטוט');
    if (!result.valid) return result;

    if (author) {
      result = this.validateMaxLength(author, 100, 'שם המחבר');
      if (!result.valid) return result;
    }

    return { valid: true };
  }

  validateMemeUpload(file: File, caption?: string, uploadedBy?: string): ValidationResult {
    let result: ValidationResult;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    result = this.validateFileType(file, allowedTypes);
    if (!result.valid) return result;

    result = this.validateFileSize(file, 10);
    if (!result.valid) return result;

    if (caption) {
      result = this.validateMaxLength(caption, 200, 'כיתוב');
      if (!result.valid) return result;
    }

    if (uploadedBy) {
      result = this.validateMaxLength(uploadedBy, 50, 'שם המעלה');
      if (!result.valid) return result;
    }

    return { valid: true };
  }
}
