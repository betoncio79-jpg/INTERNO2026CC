import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Warehouse } from './pages/warehouse/warehouse';
import { AddWarehouse } from './pages/add-warehouse/add-warehouse';
import { Stand } from './pages/stand/stand';
import { AddStand } from './pages/add-stand/add-stand';
import { Tools } from './pages/tools/tools';
import { AddTools } from './pages/add-tools/add-tools';
import { Home } from './pages/home/home';
import { ToolSearch } from './pages/tool-search/tool-search';
import { EditTool } from './pages/edit-tool/edit-tool';
import { ToolHistory } from './pages/tool-history/tool-history';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'warehouse', component: Warehouse, canActivate: [authGuard] },
  { path: 'add-warehouse', component: AddWarehouse, canActivate: [authGuard] },
  { path: 'stand', component: Stand, canActivate: [authGuard] },
  { path: 'add-stand', component: AddStand, canActivate: [authGuard] },
  { path: 'tools', component: Tools, canActivate: [authGuard] },
  { path: 'add-tools', component: AddTools, canActivate: [authGuard] },
  { path: 'tool-search', component: ToolSearch, canActivate: [authGuard] },
  { path: 'edit-tool/:id', component: EditTool, canActivate: [authGuard] },
  { path: 'tool-history/:id', component: ToolHistory, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
