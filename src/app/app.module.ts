import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { PlayerService } from './services/player.service';
import { MatchService } from './services/match.service';
import { RoutingModule } from './routing/routing.module';
import { PlayerComponent } from './player/player.component';
import { PlayerSearchComponent } from './player-search/player-search.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    PlayerSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RoutingModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [PlayerService, MatchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
