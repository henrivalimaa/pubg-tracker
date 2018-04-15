import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {
	private player = { name: '', region: 'pc-eu' };
  private regions = [
    {value: 'pc-eu'},
    {value: 'pc-na'},
    {value: 'pc-krjp'},
    {value: 'pc-jp'},
    {value: 'pc-oc'},
    {value: 'pc-kakao'},
    {value: 'pc-sea'},
    {value: 'pc-sa'},
    {value: 'pc-as'},
    {value: 'xbox-as'},
    {value: 'xbox-eu'},
    {value: 'xbox-na'},
    {value: 'xbox-oc'}
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(this.player);
  	this.router.navigate(['player'], { queryParams: { name: this.player.name, region: this.player.region } });	
  }

}
