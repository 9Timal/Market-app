import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-centre',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './centre.component.html',
  styleUrl: './centre.component.scss'
})
export class CentreComponent {

  constructor(
    private router : Router
  ){}
  
  
}
