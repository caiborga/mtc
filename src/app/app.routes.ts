import { Routes } from '@angular/router';

//Componentes
import { HomeComponent } from './pages/home/home.component';
import { ParticipantsComponent } from './pages/participants/participants.component';
import { PlannerComponent } from './pages/planner/planner.component';
import { ThingsComponent } from './pages/things/things.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'participants', component: ParticipantsComponent },
    { path: 'planner', component: PlannerComponent },
    { path: 'planner/:id', component: PlannerComponent },
    { path: 'things', component: ThingsComponent },
    //{ path: '',   redirectTo: '/heroes', pathMatch: 'full' },
    //{ path: '**', component: PageNotFoundComponent }
];
