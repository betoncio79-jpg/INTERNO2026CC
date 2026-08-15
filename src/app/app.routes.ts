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

export const routes: Routes = [
    {path:'login', component: Login},
    {path: 'home', component: Home},
    {path: 'warehouse', component: Warehouse},
    {path:'add-warehouse', component: AddWarehouse},
    {path:'stand', component: Stand},
    {path:'add-stand', component: AddStand},
    {path:'tools', component: Tools},
    {path:'add-tools', component: AddTools},
    {path: 'tool-search', component: ToolSearch},
    {path: 'edit-tool/:id', component: EditTool},
    { path: 'tool-history/:id', component: ToolHistory },
    {path: 'login', component: Login}




];
