import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { RegisterComponent } from '../Components/Landing/register/register.component';

@Component({
  selector: 'app-root',
  imports: [ServicesComponent , RegisterComponent ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'D2D Car';
}
