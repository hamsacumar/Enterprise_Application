import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = {
    services: [
      { label: 'Car Wash', url: '#wash' },
      { label: 'Detailing', url: '#detailing' },
      { label: 'Interior Cleaning', url: '#interior' },
      { label: 'Modifications', url: '#modifications' }
    ],
    company: [
      { label: 'About Us', url: '#about' },
      { label: 'Our Team', url: '#team' },
      { label: 'Locations', url: '#locations' },
      { label: 'Careers', url: '#careers' }
    ],
    support: [
      { label: 'Help Center', url: '#help' },
      { label: 'FAQs', url: '#faq' },
      { label: 'Contact Us', url: '#contact' },
      { label: 'Book Appointment', url: '#book' }
    ],
    legal: [
      { label: 'Privacy Policy', url: '#privacy' },
      { label: 'Terms of Service', url: '#terms' },
      { label: 'Refund Policy', url: '#refund' },
      { label: 'Service Agreement', url: '#agreement' }
    ]
  };

  socialLinks = [
    { icon: '🔗', name: 'LinkedIn', url: '#linkedin' },
    { icon: '𝕏', name: 'Twitter', url: '#twitter' },
    { icon: '⌘', name: 'GitHub', url: '#github' },
    { icon: 'f', name: 'Facebook', url: '#facebook' }
  ];
}

