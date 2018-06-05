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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { PlayerService } from './services/player.service';
import { MatchService } from './services/match.service';
import { TelemetryService } from './services/telemetry.service';
import { StatusService } from './services/status.service';

import { PlayerComponent } from './player/player.component';
import { PlayerSearchComponent } from './player-search/player-search.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { ComparisonDialogComponent } from './comparison-dialog/comparison-dialog.component';
import { DocumentsComponent } from './documents/documents.component';
import { MatchEventsDialogComponent } from './match-events-dialog/match-events-dialog.component';

import { RoutingModule } from './routing/routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    PlayerSearchComponent,
    MatchDetailComponent,
    ComparisonDialogComponent,
    DocumentsComponent,
    MatchEventsDialogComponent
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
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [PlayerService, MatchService, TelemetryService, StatusService],
  bootstrap: [AppComponent],
  entryComponents: [ComparisonDialogComponent, DocumentsComponent, MatchEventsDialogComponent]
})
export class AppModule { }
