import { Routes } from '@angular/router';
import { ScheduleView } from './components/schedule-view/schedule-view';
import { Admin } from './components/admin/admin';
import { AdminMemes } from './components/admin/admin-memes';
import { AdminQuotes } from './components/admin/admin-quotes';

export const routes: Routes = [
  { path: '', component: ScheduleView },
  { path: 'admin', component: Admin },
  { path: 'memes', component: AdminMemes },
  { path: 'quotes', component: AdminQuotes },
  { path: '**', redirectTo: '' }
];
