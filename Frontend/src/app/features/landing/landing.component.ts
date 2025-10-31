import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  services = [
    {
      icon: '🧼',
      title: 'Basic Wash',
      description: 'Exterior wash with premium soap and hand dry finish',
      price: 'From $25'
    },
    {
      icon: '✨',
      title: 'Premium Detailing',
      description: 'Complete interior and exterior detailing service',
      price: 'From $149'
    },
    {
      icon: '💎',
      title: 'Ceramic Coating',
      description: 'Long-lasting protection with premium ceramic coating',
      price: 'From $499'
    },
    {
      icon: '🪑',
      title: 'Interior Deep Clean',
      description: 'Professional deep cleaning of seats, carpets, and dashboard',
      price: 'From $89'
    },
    {
      icon: '🎨',
      title: 'Paint Correction',
      description: 'Remove scratches and restore your car\'s original shine',
      price: 'From $299'
    },
    {
      icon: '🔧',
      title: 'Maintenance Package',
      description: 'Regular maintenance to keep your car in perfect condition',
      price: 'From $199'
    }
  ];

  features = [
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Quick turnaround times without compromising quality'
    },
    {
      icon: '👨‍🔧',
      title: 'Expert Team',
      description: 'Certified professionals with years of experience'
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly',
      description: 'Environmentally conscious products and water-saving techniques'
    },
    {
      icon: '💯',
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee on all our services'
    },
    {
      icon: '📱',
      title: 'Easy Booking',
      description: 'Book online or via mobile app in just a few clicks'
    },
    {
      icon: '💳',
      title: 'Flexible Payment',
      description: 'Multiple payment options including subscriptions'
    }
  ];

  pricingPlans = [
    {
      name: 'Basic',
      price: 29,
      popular: false,
      features: [
        'Exterior Wash',
        'Hand Dry',
        'Tire Cleaning',
        'Window Cleaning',
        'Monthly Service'
      ],
      buttonText: 'Get Started'
    },
    {
      name: 'Premium',
      price: 79,
      popular: true,
      features: [
        'Everything in Basic',
        'Interior Vacuuming',
        'Dashboard Polish',
        'Wheel Treatment',
        'Air Freshener',
        'Bi-Weekly Service'
      ],
      buttonText: 'Most Popular'
    },
    {
      name: 'Ultimate',
      price: 149,
      popular: false,
      features: [
        'Everything in Premium',
        'Deep Interior Cleaning',
        'Paint Protection',
        'Leather Conditioning',
        'Engine Bay Clean',
        'Weekly Service'
      ],
      buttonText: 'Go Ultimate'
    }
  ];

  testimonials = [
    {
      avatar: '👨',
      name: 'Michael Johnson',
      role: 'Business Owner',
      text: 'AutoWash Pro has been taking care of my fleet for 2 years now. Exceptional service every single time! Highly recommended.'
    },
    {
      avatar: '👩',
      name: 'Sarah Williams',
      role: 'Marketing Director',
      text: 'The attention to detail is amazing! My car has never looked better. The team is professional and friendly.'
    },
    {
      avatar: '👨‍💼',
      name: 'David Chen',
      role: 'Software Engineer',
      text: 'Love the convenience of their mobile app and the quality of service. Worth every penny!'
    },
    {
      avatar: '👩‍💼',
      name: 'Emily Rodriguez',
      role: 'Real Estate Agent',
      text: 'As someone who spends a lot of time in my car, AutoWash Pro keeps it pristine. The subscription plan is perfect!'
    }
  ];
}

