import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { TestService } from '../../core/service/test/test.service';
import { HttpClientModule } from '@angular/common/http'; // needed if using HttpClient

@Component({
  selector: 'app-test',
  standalone: true,  // make it standalone
  imports: [CommonModule, HttpClientModule],  // <-- import CommonModule for *ngIf, *ngFor
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  data: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.testService.getAllData().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch data';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
