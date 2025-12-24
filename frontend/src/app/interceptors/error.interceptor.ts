import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'אירעה שגיאה בלתי צפויה';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `שגיאת רשת: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'בקשה לא תקינה';
            break;
          case 401:
            errorMessage = 'נדרשת הזדהות';
            break;
          case 403:
            errorMessage = 'אין הרשאה לבצע פעולה זו';
            break;
          case 404:
            errorMessage = 'המשאב המבוקש לא נמצא';
            break;
          case 500:
            errorMessage = 'שגיאת שרת פנימית';
            break;
          case 503:
            errorMessage = 'השירות אינו זמין כרגע';
            break;
          default:
            if (error.status >= 500) {
              errorMessage = 'שגיאת שרת';
            } else if (error.status >= 400) {
              errorMessage = 'שגיאת בקשה';
            }
        }

        if (error.error?.message) {
          errorMessage += `: ${error.error.message}`;
        }
      }

      notificationService.error(errorMessage);
      return throwError(() => error);
    })
  );
};
