import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../Services/theme.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { fixLeafletIcons } from '../../../Services/leaflet-icon-fix';

interface ServiceOrder {
  id: string;
  date: string;
  customer: string;
  vehicle: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  technician: string;
}

interface CarService {
  name: string;
  bookings: number;
  rating: number;
  price: number;
  icon: string;
}

interface RecentService {
  serviceName: string;
  date: string;
  price: number;
  icon: string;
}

interface TechnicianActivity {
  technician: string;
  action: string;
  time: string;
  icon: string;
}

interface ServiceArea {
  name: string;
  services: number;
  color: string;
  coordinates: [number, number];
  region: string;
}

interface CountryData {
  name: string;
  sales: number;
  color: string;
  coordinates: [number, number];
  region: string;
}

interface Activity {
  user: string;
  action: string;
  time: string;
  type: string;
}

interface Product {
  name: string;
  views: number;
  sales: number;
  price: number;
  image: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('worldMap', { static: false }) mapElement!: ElementRef;
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef;
  @ViewChild('customerChart', { static: false }) customerChartRef!: ElementRef;
  @ViewChild('serviceTypesChart', { static: false })
  serviceTypesChartRef!: ElementRef;

  isDarkMode = false;
  private themeSubscription?: Subscription;
  private map?: L.Map;
  private mapInitialized = false;

  // Car Service Data
  revenueData = [
    { month: 'Jan', value: 32 },
    { month: 'Feb', value: 28 },
    { month: 'Mar', value: 35 },
    { month: 'Apr', value: 42 },
    { month: 'May', value: 38 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 41 },
    { month: 'Aug', value: 47 },
    { month: 'Sep', value: 43 },
    { month: 'Oct', value: 48 },
    { month: 'Nov', value: 44 },
    { month: 'Dec', value: 52 },
  ];

  latestServiceOrders: ServiceOrder[] = [
    {
      id: '#SRV001',
      date: '07 Aug, 2025',
      customer: 'Ahmed Mohamed',
      vehicle: 'BMW X5 2021',
      serviceType: 'Engine Repair',
      amount: 750.0,
      status: 'in-progress',
      technician: 'Mohamed Ali',
    },
    {
      id: '#SRV002',
      date: '07 Aug, 2025',
      customer: 'Sara Ahmed',
      vehicle: 'Toyota Camry 2020',
      serviceType: 'Oil Change',
      amount: 85.0,
      status: 'completed',
      technician: 'Hassan Omar',
    },
    {
      id: '#SRV003',
      date: '06 Aug, 2025',
      customer: 'Omar Hassan',
      vehicle: 'Mercedes C200 2019',
      serviceType: 'Brake Service',
      amount: 420.0,
      status: 'scheduled',
      technician: 'Ali Mahmoud',
    },
    {
      id: '#SRV004',
      date: '06 Aug, 2025',
      customer: 'Fatma Ibrahim',
      vehicle: 'Honda Civic 2022',
      serviceType: 'Tire Replacement',
      amount: 280.0,
      status: 'pending',
      technician: 'Mahmoud Youssef',
    },
    {
      id: '#SRV005',
      date: '05 Aug, 2025',
      customer: 'Khaled Adel',
      vehicle: 'Audi A4 2020',
      serviceType: 'AC Repair',
      amount: 350.0,
      status: 'completed',
      technician: 'Youssef Hassan',
    },
  ];

  popularServices: CarService[] = [
    {
      name: 'Engine Diagnostics',
      bookings: 145,
      rating: 4.8,
      price: 120.0,
      icon: '🔧',
    },
    {
      name: 'Oil Change Service',
      bookings: 298,
      rating: 4.9,
      price: 75.0,
      icon: '🛢️',
    },
    {
      name: 'Brake Inspection',
      bookings: 187,
      rating: 4.7,
      price: 95.0,
      icon: '🛞',
    },
    {
      name: 'AC System Repair',
      bookings: 124,
      rating: 4.6,
      price: 275.0,
      icon: '❄️',
    },
    {
      name: 'Tire Services',
      bookings: 203,
      rating: 4.8,
      price: 180.0,
      icon: '⚙️',
    },
    {
      name: 'Battery Replacement',
      bookings: 89,
      rating: 4.9,
      price: 150.0,
      icon: '🔋',
    },
  ];

  recentServices: RecentService[] = [
    {
      serviceName: 'Engine Oil Change',
      date: '07 Aug, 2025',
      price: 75.0,
      icon: '🛢️',
    },
    {
      serviceName: 'Brake Pad Replacement',
      date: '07 Aug, 2025',
      price: 285.0,
      icon: '🛞',
    },
    {
      serviceName: 'AC System Check',
      date: '06 Aug, 2025',
      price: 120.0,
      icon: '❄️',
    },
    {
      serviceName: 'Engine Diagnostics',
      date: '06 Aug, 2025',
      price: 180.0,
      icon: '🔧',
    },
    {
      serviceName: 'Tire Rotation',
      date: '05 Aug, 2025',
      price: 65.0,
      icon: '⚙️',
    },
  ];

  technicianActivities: TechnicianActivity[] = [
    {
      technician: 'Mohamed Ali',
      action: 'completed engine repair for BMW X5',
      time: '2 hours ago',
      icon: '🔧',
    },
    {
      technician: 'Hassan Omar',
      action: 'started brake service for Mercedes C200',
      time: '3 hours ago',
      icon: '🛞',
    },
    {
      technician: 'Ali Mahmoud',
      action: 'finished oil change for Toyota Camry',
      time: '4 hours ago',
      icon: '🛢️',
    },
    {
      technician: 'Mahmoud Youssef',
      action: 'diagnosed AC issues for Honda Civic',
      time: '5 hours ago',
      icon: '❄️',
    },
  ];

  serviceAreas: ServiceArea[] = [
    {
      name: 'Cairo Downtown',
      services: 342,
      color: '#FF6B6B',
      coordinates: [30.0444, 31.2357],
      region: 'Greater Cairo',
    },
    {
      name: 'New Cairo',
      services: 278,
      color: '#4ECDC4',
      coordinates: [30.0131, 31.4969],
      region: 'Greater Cairo',
    },
    {
      name: 'Giza District',
      services: 195,
      color: '#45B7D1',
      coordinates: [30.0131, 31.2089],
      region: 'Giza',
    },
    {
      name: 'Alexandria Central',
      services: 156,
      color: '#FFA07A',
      coordinates: [31.2001, 29.9187],
      region: 'Alexandria',
    },
    {
      name: 'Shubra El Kheima',
      services: 124,
      color: '#98D8C8',
      coordinates: [30.1287, 31.2441],
      region: 'Qalyubia',
    },
    {
      name: '6th October City',
      services: 152,
      color: '#F7DC6F',
      coordinates: [29.9668, 30.9441],
      region: 'Giza',
    },
  ];

  popularCarServices: CarService[] = [
    {
      name: 'Oil Change Service',
      bookings: 487,
      rating: 4.8,
      price: 85.99,
      icon: '🛢️',
    },
    {
      name: 'Brake Repair Service',
      bookings: 452,
      rating: 4.7,
      price: 249.99,
      icon: '🛑',
    },
    {
      name: 'Engine Diagnostics',
      bookings: 562,
      rating: 4.9,
      price: 149.99,
      icon: '🔧',
    },
    {
      name: 'Tire Replacement',
      bookings: 644,
      rating: 4.6,
      price: 245.0,
      icon: '🛞',
    },
    {
      name: 'Transmission Service',
      bookings: 712,
      rating: 4.8,
      price: 374.63,
      icon: '⚙️',
    },
  ];

  recentActivities: Activity[] = [
    {
      user: 'Ahmed Hassan',
      action: 'Completed oil change service for BMW X5',
      time: '05:57 AM Today',
      type: 'service',
    },
    {
      user: 'Sara Ahmed',
      action: 'Booked brake repair service',
      time: '25 Aug, 2025',
      type: 'booking',
    },
    {
      user: 'Omar Mahmoud',
      action: 'Engine diagnostics completed',
      time: 'Service completed successfully',
      type: 'completion',
    },
  ];

  countriesData: CountryData[] = [
    {
      name: 'United States',
      sales: 15364,
      color: '#10b981',
      coordinates: [39.8283, -98.5795],
      region: 'North America',
    },
    {
      name: 'Greenland',
      sales: 12387,
      color: '#f59e0b',
      coordinates: [71.7069, -42.6043],
      region: 'North America',
    },
    {
      name: 'Serbia',
      sales: 9123,
      color: '#3b82f6',
      coordinates: [44.0165, 21.0059],
      region: 'Europe',
    },
    {
      name: 'Russia',
      sales: 7108,
      color: '#10b981',
      coordinates: [61.524, 105.3188],
      region: 'Asia',
    },
    {
      name: 'Brazil',
      sales: 6731,
      color: '#ef4444',
      coordinates: [-14.235, -51.9253],
      region: 'South America',
    },
    {
      name: 'Australia',
      sales: 3023,
      color: '#f59e0b',
      coordinates: [-25.2744, 133.7751],
      region: 'Oceania',
    },
  ];

  orderStatuses = [
    { name: 'New', count: 307, color: '#10b981' },
    { name: 'Pending', count: 177, color: '#f59e0b' },
    { name: 'Rejected', count: 39, color: '#ef4444' },
    { name: 'Returns', count: 17, color: '#ef4444' },
    { name: 'Dispatched', count: 661, color: '#3b82f6' },
    { name: 'Delivered', count: 1320, color: '#10b981' },
    { name: 'Cancelled', count: 74, color: '#ef4444' },
  ];

  trafficData = [
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 22 },
    { month: 'Apr', value: 28 },
    { month: 'May', value: 25 },
  ];

  constructor(private themeService: ThemeService) {
    // Fix Leaflet icon paths
    fixLeafletIcons();
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
        // Update map theme if map is initialized
        if (this.mapInitialized && this.map) {
          this.updateMapTheme();
        }
      }
    );
  }

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeMap();
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

  // Chart.js initialization
  private initializeCharts(): void {
    // Initialize revenue chart
    this.initRevenueChart();

    // Initialize customer acquisition chart
    this.initCustomerChart();

    // Initialize service types chart
    this.initServiceTypesChart();
  }

  private initRevenueChart(): void {
    if (!this.revenueChartRef?.nativeElement) return;

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');

    // Simulate Chart.js without import (we'll use CSS styling for now)
    // In a real implementation, you would import Chart.js properly
    console.log('Revenue Chart initialized for D2D Car Services');
  }

  private initCustomerChart(): void {
    if (!this.customerChartRef?.nativeElement) return;

    const ctx = this.customerChartRef.nativeElement.getContext('2d');
    console.log('Customer Acquisition Chart initialized');
  }

  private initServiceTypesChart(): void {
    if (!this.serviceTypesChartRef?.nativeElement) return;

    const ctx = this.serviceTypesChartRef.nativeElement.getContext('2d');
    console.log('Service Types Chart initialized');
  }

  private initializeMap(): void {
    if (!this.mapElement?.nativeElement) {
      console.error('Map element not found');
      return;
    }

    try {
      // Initialize the map focused on Egypt
      this.map = L.map(this.mapElement.nativeElement, {
        center: [30.0444, 31.2357], // Cairo, Egypt
        zoom: 8,
        minZoom: 6,
        maxZoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        attributionControl: false,
      });

      // Add tile layer
      this.addTileLayer();

      // Add markers for service areas
      this.addServiceAreaMarkers();

      // Add custom controls
      this.addCustomControls();

      this.mapInitialized = true;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private addTileLayer(): void {
    if (!this.map) return;

    const tileLayer = this.isDarkMode
      ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
      : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileLayer, {
      attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>',
      maxZoom: 20,
    }).addTo(this.map);
  }

  private addServiceAreaMarkers(): void {
    if (!this.map) return;

    this.serviceAreas.forEach((area) => {
      // Calculate marker size based on services volume
      const maxServices = Math.max(...this.serviceAreas.map((a) => a.services));
      const minSize = 20;
      const maxSize = 40;
      const size =
        minSize + (area.services / maxServices) * (maxSize - minSize);

      // Create custom icon for service areas
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container" style="
            width: ${size}px; 
            height: ${size}px; 
            background: ${area.color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size > 30 ? '12px' : '10px'};
          ">
            🚗
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      // Create marker
      const marker = L.marker(area.coordinates, { icon: customIcon }).addTo(
        this.map!
      );

      // Create popup content for service areas
      const popupContent = `
        <div class="map-popup">
          <h3 style="margin: 0 0 10px 0; color: var(--text-primary);">🚗 ${
            area.name
          }</h3>
          <div style="margin: 5px 0;">
            <strong>Region:</strong> ${area.region}
          </div>
          <div style="margin: 5px 0;">
            <strong>Services:</strong> ${area.services.toLocaleString()}
          </div>
          <div style="margin: 5px 0;">
            <strong>Revenue:</strong> $${(area.services * 125).toLocaleString()}
          </div>
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
            <small style="color: var(--text-muted);">D2D Car E-Services Coverage</small>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 250,
        closeButton: true,
      });
    });
  }
  private addCustomControls(): void {
    if (!this.map) return;

    // Add zoom control
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(this.map);

    // Add custom legend for service areas
    const LegendControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
          <div class="legend-content">
            <h4>🚗 Service Coverage</h4>
            <div class="legend-item">
              <div class="legend-color" style="background: #FF6B6B;"></div>
              <span>High Demand (>300)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #4ECDC4;"></div>
              <span>Medium Demand (200-300)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #45B7D1;"></div>
              <span>Growing Area (100-200)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #FFA07A;"></div>
              <span>New Service Area</span>
            </div>
          </div>
        `;
        return div;
      },
      options: {
        position: 'topright',
      },
    });

    new LegendControl().addTo(this.map);
  }

  private updateMapTheme(): void {
    if (!this.map) return;

    // Remove current tile layer
    this.map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        this.map!.removeLayer(layer);
      }
    });

    // Add new tile layer with updated theme
    this.addTileLayer();
  }

  // Car service specific utility methods
  getTotalServices(): number {
    return this.serviceAreas.reduce((total, area) => total + area.services, 0);
  }

  getAverageRevenue(): number {
    const totalRevenue = this.serviceAreas.reduce(
      (total, area) => total + area.services * 125, // Average revenue per service
      0
    );
    return totalRevenue / this.serviceAreas.length;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getStatusClass(status: string): string {
    const classes = {
      pending: 'status-pending',
      completed: 'status-delivered',
      'in-progress': 'status-shipping',
      scheduled: 'status-new',
      cancelled: 'status-out-delivered',
    };
    return classes[status as keyof typeof classes] || 'status-default';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getMaxValue(data: any[]): number {
    return Math.max(...data.map((item) => item.value || item.count));
  }

  getBarWidth(value: number, maxValue: number): number {
    return (value / maxValue) * 100;
  }
}
