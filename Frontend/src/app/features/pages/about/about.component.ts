import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // About section data
  aboutTitle = 'About AutoServeX';
  aboutIntro = 'Your Trusted Partner in Vehicle Excellence';
  
  companyStory = [
    {
      year: '2018',
      title: 'Founded',
      description: 'Started with a vision to revolutionize vehicle care services with professional expertise and eco-friendly practices.'
    },
    {
      year: '2019',
      title: 'First Expansion',
      description: 'Opened 5 additional locations across the city, establishing ourselves as a trusted local brand.'
    },
    {
      year: '2020',
      title: 'Award Recognition',
      description: 'Won Best Vehicle Care Service Award and Eco-Friendly Business Recognition.'
    },
    {
      year: '2023',
      title: 'Digital Transformation',
      description: 'Launched mobile app and AI-powered booking system for enhanced customer experience.'
    }
  ];

  // Team members
  teamMembers = [
    {
      id: 1,
      name: 'John Anderson',
      role: 'Founder & CEO',
      image: '/assets/images/mechanic1.webp',
      bio: '20+ years in automotive services with passion for excellence'
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Operations Director',
      image: '/assets/images/repair man1.jpg',
      bio: 'Expert in process optimization and customer satisfaction'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      role: 'Lead Technician',
      image: '/assets/images/mechanic2.jpg',
      bio: 'Master technician with certified training in all vehicle types'
    },
    {
      id: 4,
      name: 'Emma Chen',
      role: 'Sustainability Manager',
      image: '/assets/images/mechanic3.jpg',
      bio: 'Dedicated to eco-friendly practices and green initiatives'
    }
  ];

  // Company values
  values = [
    {
      image: '/assets/images/Excellence.jpeg',
      title: 'Excellence',
      description: 'We strive for excellence in every service we provide, ensuring customer satisfaction at every touchpoint.'
    },
    {
      image: '/assets/images/sustainability.jpg',
      title: 'Sustainability',
      description: 'Using eco-friendly products and practices to protect our environment while delivering superior results.'
    },
    {
      image: '/assets/images/reliablity.webp',
      title: 'Reliability',
      description: 'We are committed to being dependable partners you can trust with your vehicle care needs.'
    },
    {
      image: '/assets/images/Community.jpg',
      title: 'Community',
      description: 'Supporting local communities and building long-term relationships with our customers.'
    }
  ];

  // Statistics
  stats = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '8', label: 'Service Locations' },
    { number: '150+', label: 'Expert Technicians' },
    { number: '15+', label: 'Years Experience' }
  ];
}
