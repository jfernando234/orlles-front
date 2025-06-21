import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  subscriptionEmail: string = '';

  // Configuración de enlaces
  quickLinks = [
    { name: 'Inicio', url: '/' },
    { name: 'Productos', url: '/productos' },
    { name: 'Sobre nosotros', url: '/sobre-nosotros' },
    { name: 'Contacto', url: '/contacto' }
  ];

  // Información de contacto
  contactInfo = {
    address: 'Av. Principal 123, Ciudad',
    phone: '+123 456 7890',
    email: 'info@imporllesinc.com'
  };

  // Enlaces de redes sociales
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialización del componente
  }

  /**
   * Maneja el envío del formulario de suscripción
   */
  onSubscribe(): void {
    if (this.subscriptionEmail && this.isValidEmail(this.subscriptionEmail)) {
      // Aquí iría la lógica para enviar el email de suscripción
      console.log('Suscripción enviada:', this.subscriptionEmail);

      // Simular envío exitoso
      this.showSuccessMessage('¡Gracias por suscribirte! Te mantendremos informado.');
      this.subscriptionEmail = '';
    } else {
      this.showErrorMessage('Por favor, ingresa un email válido.');
    }
  }

  /**
   * Valida el formato del email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Muestra mensaje de éxito (en una implementación real usarías un servicio de notificaciones)
   */
  private showSuccessMessage(message: string): void {
    // Implementar notificación de éxito
    alert(message); // Temporal - reemplazar con un sistema de notificaciones real
  }

  /**
   * Muestra mensaje de error (en una implementación real usarías un servicio de notificaciones)
   */
  private showErrorMessage(message: string): void {
    // Implementar notificación de error
    alert(message); // Temporal - reemplazar con un sistema de notificaciones real
  }

  /**
   * Navega a un enlace específico
   */
  navigateTo(url: string): void {
    // Implementar navegación usando Angular Router
    window.location.href = url; // Temporal - reemplazar con Router.navigate()
  }

  /**
   * Abre enlace de red social en nueva ventana
   */
  openSocialLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
