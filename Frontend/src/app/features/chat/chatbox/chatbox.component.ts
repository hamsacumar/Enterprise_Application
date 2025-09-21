import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent implements OnInit {
  chatMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getChatData();
  }

  getChatData() {
    this.http
      .get<{ message: string }>('http://localhost:5000/api/chatbox')
      .subscribe({
        next: (res) => {
          this.chatMessage = res.message;
        },
        error: (err) => {
          console.error('Error fetching chat data', err);
        },
      });
  }
}
