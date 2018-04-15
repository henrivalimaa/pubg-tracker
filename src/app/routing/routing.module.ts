import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { PlayerComponent } from '../player/player.component';

const routes: Routes = [
	{ path: '', redirectTo: '/player', pathMatch: 'full' },
  { path: 'player', component: PlayerComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class RoutingModule { }