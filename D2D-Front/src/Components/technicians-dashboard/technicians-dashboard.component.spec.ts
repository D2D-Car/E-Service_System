import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniciansDashboardComponent } from './technicians-dashboard.component';

describe('TechniciansDashboardComponent', () => {
  let component: TechniciansDashboardComponent;
  let fixture: ComponentFixture<TechniciansDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechniciansDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechniciansDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
