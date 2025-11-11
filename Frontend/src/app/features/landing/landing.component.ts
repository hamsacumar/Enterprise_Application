import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {}

  showRoleSidebar = false;
  demoMode = false;

  ngOnInit() {
    // Check if we're in demo mode
    this.demoMode = localStorage.getItem('demoMode') === 'true';
  }

  getCurrentDemoRole(): string {
    return localStorage.getItem('userRole') || 'User';
  }

  // Hero section
  heroTitle = 'Professional Vehicle Care Services';
  heroSubtitle = 'Keep Your Vehicle Looking Showroom Fresh with Our Expert Care';

  // Services
  services = [
    {
      id: 1,
      icon: 'assets/images/carwash.webp',
      title: 'Car Wash',
      description: 'Professional exterior and interior cleaning using premium eco-friendly products.'
    },
    {
      id: 2,
      icon: 'assets/images/detailing.jpg',
      title: 'Detailing',
      description: 'Complete vehicle detailing including ceramic coating and paint restoration.'
    },
    {
      id: 3,
      icon: 'assets/images/maintenance.jpg',
      title: 'Maintenance',
      description: 'Regular maintenance services to keep your car running smoothly.'
    },
    {
      id: 4,
      icon: 'assets/images/protection.jpg',
      title: 'Protection',
      description: 'Advanced protective treatments including paint protection film.'
    },
    {
      id: 5,
      icon: 'assets/images/interior.jpg',
      title: 'Interior Cleaning',
      description: 'Deep cleaning of carpets, upholstery and sanitization.'
    },
    {
      id: 6,
      icon: 'assets/images/express.jpg',
      title: 'Express Service',
      description: 'Quick wash and vacuum service in 30 minutes or less.'
    }
  ];

  // Features
  features = [
    { icon: 'assets/images/Expert.jpg', title: 'Expert Technicians', description: 'Certified professionals with 10+ years of experience' },
    { icon: 'assets/images/Eco_friendly.jpg', title: 'Eco-Friendly', description: 'Sustainable products safe for your car and environment' },
    { icon: 'assets/images/competitive.webp', title: 'Competitive Pricing', description: 'Best value with flexible payment plans' },
    { icon: 'assets/images/time.jpg', title: 'Time Efficient', description: 'Quick turnaround without compromising quality' },
    { icon: 'assets/images/multiple_location.jpg', title: 'Multiple Locations', description: 'Conveniently located branches across the city' },
    { icon: 'assets/images/quality.jpg', title: 'Quality Guarantee', description: '100% satisfaction guaranteed or money back' }
  ];

  // Testimonials
  testimonials = [
    {
      stars: 5,
      text: 'AutoServex transformed my car! The detailing service is exceptional and the staff is incredibly professional.',
      author: 'John Smith'
    },
    {
      stars: 5,
      text: 'Best car wash service in the city! The express service saved me so much time, and my car looks brand new.',
      author: 'Sarah Johnson'
    },
    {
      stars: 5,
      text: 'I\'ve been using AutoServex for 2 years now. Their maintenance service keeps my car in perfect condition.',
      author: 'Michael Chen'
    },
    {
      stars: 5,
      text: 'The ceramic coating they applied gives my car an incredible shine. Professional work and amazing service!',
      author: 'Emma Williams'
    }
  ];

  // Generate star rating
  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Role selection methods
  toggleRoleSidebar(): void {
    this.showRoleSidebar = !this.showRoleSidebar;
  }

  selectRole(role: string): void {
    localStorage.setItem('userRole', role);
    localStorage.setItem('demoMode', 'true');
    this.showRoleSidebar = false;
    this.demoMode = true;
    // Navigate to the appropriate dashboard based on role
    if (role === 'Admin') {
      this.router.navigate(['/app/admin/dashboard']);
    } else if (role === 'Worker') {
      this.router.navigate(['/app/worker/dashboard']);
    } else {
      this.router.navigate(['/app/user/dashboard']);
    }
  }

  exitDemoMode(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('demoMode');
    this.demoMode = false;
    this.router.navigate(['/']);
  }
}
