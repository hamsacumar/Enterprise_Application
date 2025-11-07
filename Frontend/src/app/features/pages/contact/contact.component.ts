import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  // Contact information
  contactInfo = [
    {
      image: '/assets/images/address.webp',
      title: 'Address',
      value: '123 Service Lane, Auto City, AC 12345',
      details: 'Main Head Office'
    },
    {
      image: '/assets/images/phone.png',
      title: 'Phone',
      value: '+1 (800) 555-0123',
      details: 'Available 24/7'
    },
    {
      image: '/assets/images/Email.webp',
      title: 'Email',
      value: 'support@autoservex.com',
      details: 'Response within 24 hours'
    },
    {
      image: '/assets/images/business.webp',
      title: 'Business Hours',
      value: 'Mon-Fri: 9AM - 6PM',
      details: 'Sat-Sun: 10AM - 4PM'
    }
  ];

  // Service locations
  locations = [
    {
      name: 'Downtown Branch',
      address: '456 Main St, Downtown',
      phone: '+1 (800) 555-0124',
      hours: '8AM - 7PM'
    },
    {
      name: 'North Side Branch',
      address: '789 North Ave, North Side',
      phone: '+1 (800) 555-0125',
      hours: '9AM - 6PM'
    },
    {
      name: 'Airport Branch',
      address: '321 Airport Rd, Airport Zone',
      phone: '+1 (800) 555-0126',
      hours: '7AM - 9PM'
    },
    {
      name: 'Westside Branch',
      address: '654 West Blvd, West Side',
      phone: '+1 (800) 555-0127',
      hours: '9AM - 8PM'
    }
  ];

  // FAQ items
  faqItems = [
    {
      question: 'What is your cancellation policy?',
      answer: 'You can cancel or reschedule appointments up to 24 hours before your scheduled service with no penalty.'
    },
    {
      question: 'Do you offer mobile services?',
      answer: 'Yes! We offer mobile car wash and basic detailing services at your location for a small additional fee.'
    },
    {
      question: 'Are your products eco-friendly?',
      answer: 'Absolutely. All our cleaning products are biodegradable, non-toxic, and environmentally safe.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, digital wallets, and cash at our locations.'
    },
    {
      question: 'Do you offer corporate packages?',
      answer: 'Yes, we provide corporate discounts and fleet management services. Contact our corporate team for details.'
    },
    {
      question: 'How long does a typical service take?',
      answer: 'Services range from 30 minutes for express wash to 4 hours for complete detailing packages.'
    }
  ];

  expandedFAQ: { [key: number]: boolean } = {};

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      serviceType: ['general', Validators.required]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    // Simulate API call
    console.log('Form Data:', this.contactForm.value);
    
    // Show success message
    this.successMessage = '✅ Message sent successfully! We will get back to you within 24 hours.';
    
    // Reset form after 2 seconds
    setTimeout(() => {
      this.contactForm.reset();
      this.submitted = false;
      this.successMessage = '';
    }, 3000);
  }

  toggleFAQ(index: number): void {
    this.expandedFAQ[index] = !this.expandedFAQ[index];
  }

  isFAQExpanded(index: number): boolean {
    return this.expandedFAQ[index] || false;
  }
}

