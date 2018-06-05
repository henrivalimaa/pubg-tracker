import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PlayerSearchComponent } from './player-search/player-search.component';
import { StatusService } from './services/status.service'

import { DocumentsComponent } from './documents/documents.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	private apiStatus: any;

	constructor(private statusService: StatusService, public dialog: MatDialog) { }

	ngOnInit () {
		this.getApiStatus()
	}

	getApiStatus(): void {
		this.statusService.getApiStatus()
			.subscribe(response => {
				this.apiStatus = response;
			});
	}

	openDocument(document: string): void {
		let object = { name: document }
		let dialogRef = this.dialog.open(DocumentsComponent, {
			width: '60em',
			data: object
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The document dialog was closed');
		});
	}
}