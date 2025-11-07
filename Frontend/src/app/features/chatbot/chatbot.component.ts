import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService } from './service/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isUser?: boolean;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;
  isStreaming = false;
  useStreaming = true;
  isConnected = true;

  private wsSubscription: any;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.checkBackendHealth();

    if (this.useStreaming) {
      this.wsSubscription = this.chatbotService.connectWebSocket().subscribe({
        next: (chunk: string) => this.appendAssistantChunk(chunk),
        error: (err) => this.handleWebSocketError(err),
        complete: () => this.finishAssistantMessage()
      });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  checkBackendHealth() {
    this.chatbotService.checkHealth().subscribe({
      next: () => (this.isConnected = true),
      error: () => (this.isConnected = false)
    });
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date(),
      isUser: true,
      isCompleted: true
    };
    this.messages.push(userMessage);

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isUser: false,
      isCompleted: false
    };
    this.messages.push(assistantMessage);

    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    if (this.useStreaming) {
      this.chatbotService.sendMessageWebSocket(messageToSend);
    } else {
      const history = this.messages.slice(0, -1).map(msg => ({ role: msg.role, content: msg.content }));
      this.chatbotService.sendMessage(messageToSend, history).subscribe({
        next: (res) => {
          assistantMessage.content = res?.response ?? 'No response';
          assistantMessage.isCompleted = true;
          this.isLoading = false;
        },
        error: () => {
          assistantMessage.content = 'Error processing request.';
          assistantMessage.isCompleted = true;
          this.isLoading = false;
        }
      });
    }
  }

  private appendAssistantChunk(chunk: string) {
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.content += chunk;
    }
  }

  private finishAssistantMessage() {
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.isCompleted = true;
    }
    this.isLoading = false;
  }

  private handleWebSocketError(err: any) {
    console.error('WebSocket error', err);
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.content = 'Error receiving response.';
      lastMsg.isCompleted = true;
    }
    this.isLoading = false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleStreaming() {
    this.useStreaming = !this.useStreaming;
  }

  clearChat() {
    this.messages = [];
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
