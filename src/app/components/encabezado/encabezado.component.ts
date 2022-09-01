import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  posts;
  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  
  
        this.posts = [
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          },
          {id:1 ,
            title:"1",
            body:"1"

          },
          {id:2 ,
            title:"2",
            body:"2"

          }
        ];
  
  }

}
