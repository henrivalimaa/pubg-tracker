import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comparison-dialog',
  templateUrl: './comparison-dialog.component.html',
  styleUrls: ['./comparison-dialog.component.css']
})
export class ComparisonDialogComponent implements OnInit {

	constructor(
    public dialogRef: MatDialogRef<ComparisonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}

  ngAfterViewInit() {
  }

  isHighlighted(id: string, key: string, value: number): any {
  	for (let player of this.data) {
  		if (player.id === id) continue;
  		if (player.attributes.stats[key] > value) {
  			return { 'highlight': false};
  		}
  	}
  	return  { 'highlight': true };
  }

  removePlayer(index: number): void {
  	if (this.data.length == 2) return; 
  	else this.data.splice(index, 1);
  }

  close(): void {
    this.dialogRef.close();
  }

}
