import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-tool-history',
  imports: [CommonModule],
  templateUrl: './tool-history.html',
  styleUrl: './tool-history.css',
})
export class ToolHistory implements OnInit {

  private firestoreService = inject(FirestoreService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  historial: any[] = [];
  toolName = '';
  toolId = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    this.toolId = this.route.snapshot.paramMap.get('id') || '';

    const allHistorial = await this.firestoreService.getAll<any>('historial');
    this.historial = allHistorial
      .filter(h => h.tool_id === this.toolId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    if (this.historial.length > 0) {
      this.toolName = this.historial[0].tool_name;
    }

    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigate(['/tools']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}