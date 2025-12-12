import { Routes } from '@angular/router';
import { ScheduleView } from './components/schedule-view/schedule-view';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: ScheduleView },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' }
];
