import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface ChatMessage {
  message: string;
  history: Array<{ role: string; content: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://127.0.0.1:8000';
  private ws!: WebSocket;
  private messageSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  /** Connects to the WebSocket for streaming AI responses */
  connectWebSocket(): Observable<string> {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(`${this.apiUrl.replace('http', 'ws')}/ws/chat`);

      this.ws.onopen = () => console.log('✅ WebSocket connected');

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'ai_stream') {
          // Handle streaming chunks
          this.messageSubject.next(data.chunk);
        } 
        else if (data.type === 'ai_reply') {
          // Handle full reply from backend
          this.messageSubject.next(data.text);
        } 
        else if (data.type === 'ai_complete') {
          // Stop typing indicator / complete message
          this.messageSubject.complete();
        }
      };

      this.ws.onerror = (err) => this.messageSubject.error(err);
      this.ws.onclose = () => console.log('🔴 WebSocket closed');
    }

    return this.messageSubject.asObservable();
  }

  /** Sends a user message over the WebSocket */
  sendMessageWebSocket(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'user_message', text: message }));
    } else {
      console.error('WebSocket is not open');
    }
  }

  /** Optional REST fallback for non-streaming */
  sendMessage(message: string, history: Array<{ role: string; content: string }> = []): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { message, history });
  }

  /** Health check */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
