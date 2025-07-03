import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingComponent } from "./shared/loading/loading.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MenuBurgerComponent } from "./components/burger-menu/burger-menu.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, LoadingComponent, NavbarComponent, MenuBurgerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  isLoading = false;


  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.isLoading = false, 300); // pour laisser le temps à la transition
      }
    });
  }

  showMenu(): boolean {
    const authPages = ['/login', '/register'];
    return authPages.includes(this.router.url);
  }

}
