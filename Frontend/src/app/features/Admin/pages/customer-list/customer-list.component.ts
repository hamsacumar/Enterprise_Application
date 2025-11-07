import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Customer {
  username: string;
  email: string;
  carModel: string;
  licensePlate: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {
  customers: Customer[] = [
    {
      username: 'Niroshan Perera',
      email: 'niroshan.perera@gmail.com',
      carModel: 'Toyota Axio 2018',
      licensePlate: 'CAD-1234',
      phoneNumber: '+94 77 456 7890',
      address: 'No. 45, Galle Road, Colombo 03'
    },
    {
      username: 'Dilini Fernando',
      email: 'dilini.fernando@yahoo.com',
      carModel: 'Honda Grace 2019',
      licensePlate: 'KDA-8765',
      phoneNumber: '+94 71 234 5678',
      address: 'No. 12, Kandy Road, Kegalle'
    },
    {
      username: 'Sajith Kumara',
      email: 'sajith.kumara@gmail.com',
      carModel: 'Nissan X-Trail 2020',
      licensePlate: 'CBB-3344',
      phoneNumber: '+94 75 987 1122',
      address: 'No. 20, Main Street, Matara'
    },
    {
      username: 'Heshani Weerasinghe',
      email: 'heshaniw@gmail.com',
      carModel: 'Suzuki Wagon R 2021',
      licensePlate: 'KBM-5512',
      phoneNumber: '+94 78 552 4433',
      address: 'No. 9, Temple Road, Gampaha'
    },
    {
      username: 'Ravindu Jayasuriya',
      email: 'ravindu.j@gmail.com',
      carModel: 'Mazda Demio 2017',
      licensePlate: 'CAX-2241',
      phoneNumber: '+94 76 445 9876',
      address: 'No. 78, Beach Road, Negombo'
    }
  ];
}
