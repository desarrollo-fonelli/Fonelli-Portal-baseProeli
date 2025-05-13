import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pedclte-medidas',
  templateUrl: './pedclte-medidas.component.html',
  styleUrls: ['./pedclte-medidas.component.css']
})
export class PedclteMedidasComponent implements OnInit {
  @Input() articulo: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

  }

}
