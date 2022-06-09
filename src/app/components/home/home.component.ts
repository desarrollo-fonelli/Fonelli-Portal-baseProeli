import { Component, OnInit,ChangeDetectorRef, } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
declare let AOS: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileQuery: MediaQueryList;


  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
this.mobileQuery.removeListener(this._mobileQueryListener);
    AOS.init();

  }

}
