import { Component, OnInit } from '@angular/core';

import { WhatsappConfig } from './whatsapp-config';
import { WhatsappButtonService } from './whatsapp-button.service';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent implements OnInit {

  // Almacenará la configuración cargada desde el servicio
  public config: WhatsappConfig | undefined;

  constructor(private whatsappService: WhatsappButtonService) { }

  ngOnInit(): void {
    this.whatsappService.getConfig().subscribe(data => {
      this.config = data;
    });
  }

  /**
   * Construye la URL de WhatsApp y la abre en una nueva pestaña.
   */
  openWhatsAppChat(): void {
    if (!this.config) {
      console.error('La configuración de WhatsApp no se ha cargado.');
      return;
    }

    // Codificamos el mensaje para que sea seguro en una URL
    const encodedMessage = encodeURIComponent(this.config.defaultMessage);
    const whatsappUrl = `https://wa.me/${this.config.phoneNumber}?text=${encodedMessage}`;

    // Abrimos el enlace en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  }

}
