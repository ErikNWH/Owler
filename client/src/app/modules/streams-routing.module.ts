import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { StreamsComponent } from '../components/streams/streams.component';
import { AuthGuard } from '../services/auth.guard';


const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
 
  }
];

@NgModule({
  exports: [
    RouterModule    
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})

export class StreamsRoutingModule { }
