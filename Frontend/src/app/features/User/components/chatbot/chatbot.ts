import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  isOpen = signal(false);
  messages = signal<string[]>([
    "Hi! I'm AutoBot 🤖. Need to check service slots or progress?"
  ]);
  inputText = '';

  toggle(){
    this.isOpen.update(v => !v);
  }

  send(){
    const text = this.inputText?.trim();
    if (!text) return;
    this.messages.update(arr => [...arr, text, 'Thanks! (dummy response)']);
    this.inputText = '';
  }
}
