import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
	constructor(
    public dialogRef: MatDialogRef<DocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}

  ngAfterViewInit() {
  	console.log(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }

}
