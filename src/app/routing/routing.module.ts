import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';

import { PlayerComponent } from '../player/player.component';
import { MatchDetailComponent } from '../match-detail/match-detail.component';

const routes: Routes = [
	{ path: '', redirectTo: '/player', pathMatch: 'full' },
  { path: 'player', component: PlayerComponent },
  { path: 'match-detail', component: MatchDetailComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class RoutingModule { }