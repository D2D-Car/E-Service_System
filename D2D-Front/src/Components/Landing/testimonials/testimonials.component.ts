import { Component } from '@angular/core';
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-testimonials',
  imports: [AboutComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {

}
