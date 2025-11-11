import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private messagesSource = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSource.asObservable();
  private chatId?: string;
  private username = '';

  constructor(private http: HttpClient) {}

  // ✅ Connect socket using auth token
  connect(username: string, chatId?: string): void {
    this.username = username;
    this.chatId = chatId;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No auth token found, cannot connect.');
      return;
    }

    this.socket = io(environment.socketUrl, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      if (this.chatId) this.socket.emit('joinChat', this.chatId);
    });

    this.socket.on('receiveMessage', (msg) => {
      const current = this.messagesSource.getValue();
      this.messagesSource.next([...current, msg]);
    });
  }

  // ✅ Join chat room
  joinChat(chatId: string): void {
    this.chatId = chatId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinChat', chatId);
    }
  }

  // ✅ Listen for messages
  onMessage(): Observable<any> {
    return this.messages$;
  }

  // ✅ Listen for conversation updates
  onConversationUpdate(): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) return;
      this.socket.on('conversationUpdate', (data) => observer.next(data));
    });
  }

  // ✅ Seed message history (used when loading past messages)
  setHistory(messages: any[]): void {
    this.messagesSource.next(messages || []);
  }

  // ✅ Fetch all chats for current user
  getChats(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${environment.apiUrl}/chats`, { headers });
  }

  // ✅ Fetch messages for a chat
  getMessages(chatId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${environment.apiUrl}/messages/${chatId}`, { headers });
  }

  // ✅ Mark chat as read for current viewer
  markRead(chatId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${environment.apiUrl}/chats/${chatId}/read`, {}, { headers });
  }

  // ✅ Create a chat with a specific receiver (e.g., Admin)
  createChat(receiverId: string, receiverUsername: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${environment.apiUrl}/chats`, { receiverId, receiverUsername }, { headers });
  }

  // ✅ Get or create the single Customer↔Company chat for current user (role-based)
  getOrCreateCompanyChat(): Observable<any> {
    return new Observable((observer) => {
      this.getChats().subscribe({
        next: (chats) => {
          const existing = (chats || [])[0];
          if (existing) {
            observer.next(existing);
            if ((observer as any).complete) (observer as any).complete();
            return;
          }
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          this.http.post(`${environment.apiUrl}/chats`, {}, { headers }).subscribe({
            next: (chat) => {
              observer.next(chat);
              if ((observer as any).complete) (observer as any).complete();
            },
            error: (err) => observer.error && observer.error(err),
          });
        },
        error: (err) => observer.error && observer.error(err),
      });
    });
  }

  // ✅ Send message (role-aware). REST saves; socket broadcast updates UI instantly
  sendMessage(data: { chatId: string; content: string; senderRole: 'Customer' | 'Company' }): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Save via REST (server infers role from token)
    this.http.post(`${environment.apiUrl}/messages`, { chatId: data.chatId, content: data.content }, { headers }).subscribe({
      next: () => console.log('💾 Message saved to DB'),
      error: (err) => console.error('❌ Save message failed', err),
    });

    // Emit socket event for real-time UI with senderRole and client timestamp
    if (this.socket)
      this.socket.emit('sendMessage', {
        chatId: data.chatId,
        content: data.content,
        senderRole: data.senderRole,
        createdAt: new Date().toISOString(),
      });
  }

  // ✅ Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('🔌 Socket disconnected');
    }
  }
}
