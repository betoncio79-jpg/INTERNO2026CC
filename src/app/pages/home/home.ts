import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  // Servicio para comunicarse con Firestore
  private firestoreService = inject(FirestoreService);

  // Servicio para navegar entre pantallas
  private router = inject(Router);

  // Fuerza a Angular a actualizar la vista después de cargar datos
  private cdr = inject(ChangeDetectorRef);

  // Variables que almacenan los totales para mostrar en el panel
  totalWarehouses = 0;
  totalStands = 0;
  totalTools = 0;

  // Arreglo que guarda las últimas 4 herramientas registradas
  recentTools: any[] = [];

  // Se ejecuta automáticamente cuando el componente carga
  async ngOnInit() {
    // Obtiene todos los documentos de cada colección en Firestore
    const warehouses = await this.firestoreService.getAll('warehouse');
    const stands = await this.firestoreService.getAll('stands');
    const tools = await this.firestoreService.getAll<any>('tools');

    // Cuenta cuántos documentos hay en cada colección
    this.totalWarehouses = warehouses.length;
    this.totalStands = stands.length;
    this.totalTools = tools.length;

    // Toma solo las primeras 4 herramientas para mostrar en el panel
    this.recentTools = tools.slice(0, 4);

    // Actualiza la vista con los datos cargados
    this.cdr.detectChanges();
  }

  // Navega a la pantalla de agregar bodega
  goToAddWarehouse() {
    this.router.navigate(['/add-warehouse']);
  }

  // Navega a la pantalla de agregar herramienta
  goToAddTools() {
    this.router.navigate(['/add-tools']);
  }

  // Navega al listado completo de herramientas
  goToTools() {
    this.router.navigate(['/tools']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}