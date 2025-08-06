import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './technician-profile.component.html',
  styleUrl: './technician-profile.component.css'
})
export class TechnicianProfileComponent implements OnInit {
  technicianForm!: FormGroup;
  years: number[] = [];
  specializations: string[] = [
    'Engine Repair',
    'Transmission',
    'Brake System',
    'Electrical System',
    'Air Conditioning',
    'Body Work',
    'Paint & Detailing',
    'Tire Services',
    'Oil Change',
    'General Maintenance'
  ];

  technicians: any[] = [];
  currentTechnician: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}
}