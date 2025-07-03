import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { MappingComponent } from './pages/mapping/mapping.component';
import { HistoryComponent } from './pages/history/history.component';
import { CartComponent } from './pages/cart/cart.component';
import { CentreComponent } from './pages/admin/centre/centre.component';
import { authGuard } from './services/auth.guard';
import { superAdminGuard } from './services/super-admin.guard';
import { CentreUserComponent } from './pages/admin/centre-user/centre-user.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard]  },
  { path: 'mapping', component: MappingComponent, canActivate: [authGuard]  },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard]  },
  { path: 'cart', component: CartComponent, canActivate: [authGuard]  },
  { path: 'centre', component: CentreComponent, canActivate: [authGuard, superAdminGuard],  },
  { path: 'centre/user', component: CentreUserComponent, canActivate: [authGuard, superAdminGuard],  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];