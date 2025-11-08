import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  selectedUser: any = null;
  users: any[] = [];
  messages: any[] = [];
  newMessage = '';
  connected = false;
  private refreshHandle: any;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to use the chat!');
      window.location.href = '/login';
      return;
    }

    try {
      // ✅ Decode token to get user
      const decoded: any = jwtDecode(token);
      this.currentUser = decoded.user || decoded;
      if (!this.currentUser?._id && this.currentUser?.id) {
        this.currentUser._id = this.currentUser.id;
      }
      // normalize role from token (handles numeric enums, numeric strings, or string in any casing)
      const rawRole =
        (this.currentUser && (this.currentUser.role ?? this.currentUser.Role ?? this.currentUser.userRole ?? this.currentUser.UserRole)) ?? '';
      let roleStr = '';
      if (typeof rawRole === 'number') {
        roleStr = rawRole === 0 ? 'Customer' : rawRole === 1 ? 'Worker' : 'Admin';
      } else if (typeof rawRole === 'string') {
        const trimmed = rawRole.trim();
        if (/^\d+$/.test(trimmed)) {
          const n = parseInt(trimmed, 10);
          roleStr = n === 0 ? 'Customer' : n === 1 ? 'Worker' : 'Admin';
        } else {
          const lower = trimmed.toLowerCase();
          roleStr = lower === 'customer' ? 'Customer' : lower === 'worker' ? 'Worker' : 'Admin';
        }
      }
      this.currentUser.role = roleStr;

      // ✅ Connect with username
      this.chatService.connect(this.currentUser.username);

      // ✅ Listen for full message list updates
      this.chatService.onMessage().subscribe((msgs: any[]) => {
        this.messages = msgs || [];
        this.scrollToBottom();
        if (this.selectedUser?.chatId) {
          this.chatService.markRead(this.selectedUser.chatId).subscribe({ next: () => {}, error: () => {} });
          this.users = (this.users || []).map((u) => (u.chatId === this.selectedUser.chatId ? { ...u, unreadCount: 0 } : u));
        }
      });

      // ✅ Listen for conversation updates
      this.chatService.onConversationUpdate().subscribe((update: any) => {
        console.log('Conversation updated:', update);
      });

      // ✅ Role-based behavior
      const roleLower = (this.currentUser?.role || '').toString().toLowerCase();
      const isCompanyAgent = roleLower === 'admin' || roleLower === 'worker';
      const isCustomer = roleLower === 'customer';
      if (isCompanyAgent) {
        // Admin/Worker: list all customer chats
        this.chatService.getChats().subscribe({
          next: (chats: any[]) => {
            const mapped = (chats || [])
              .map((c: any) => {
                const customer = (c?.participants || []).find((p: any) => p.role === 'Customer');
                return customer ? { chatId: c._id, username: customer.username, unreadCount: c.unreadCount || 0 } : null;
              })
              .filter((x: any) => !!x);
            this.users = mapped;
            if (this.users.length) this.selectUser(this.users[0]);
            this.startAgentPolling();
          },
          error: (err: any) => console.error('Failed to load company chats', err),
        });
      } else if (isCustomer) {
        // Customer: ensure a dedicated Company chat exists and load it
        this.chatService.getOrCreateCompanyChat().subscribe({
          next: (chat: any) => {
            this.selectedUser = {
              chatId: chat._id,
              username: environment.companyName,
            };
            this.users = [this.selectedUser];

            this.chatService.joinChat(chat._id);
            this.chatService.getMessages(chat._id).subscribe({
              next: (msgs) => {
                this.messages = msgs || [];
                this.chatService.setHistory(this.messages);
                this.scrollToBottom();
                this.chatService.markRead(chat._id).subscribe({ next: () => {}, error: () => {} });
              },
              error: (err: any) => console.error('Failed to load messages', err),
            });
          },
          error: (err: any) => console.error('Failed to get/create company chat', err),
        });
      } else {
        // Fallback: role missing/unknown. Probe via chat list.
        this.chatService.getChats().subscribe({
          next: (chats: any[]) => {
            const hasCustomerChats = Array.isArray(chats) && chats.some((c: any) =>
              Array.isArray(c?.participants) && c.participants.some((p: any) => p.role === 'Customer')
            );
            if (hasCustomerChats) {
              const mapped = (chats || [])
                .map((c: any) => {
                  const customer = (c?.participants || []).find((p: any) => p.role === 'Customer');
                  return customer ? { chatId: c._id, username: customer.username } : null;
                })
                .filter((x: any) => !!x);
              this.users = mapped;
              if (this.users.length) this.selectUser(this.users[0]);
              return;
            }
            this.chatService.getOrCreateCompanyChat().subscribe({
              next: (chat: any) => {
                this.selectedUser = { chatId: chat._id, username: environment.companyName };
                this.users = [this.selectedUser];
                this.chatService.joinChat(chat._id);
                this.chatService.getMessages(chat._id).subscribe({
                  next: (msgs) => {
                    this.messages = msgs || [];
                    this.chatService.setHistory(this.messages);
                    this.scrollToBottom();
                  },
                  error: (err: any) => console.error('Failed to load messages', err),
                });
              },
              error: (err: any) => console.error('Failed to get/create company chat', err),
            });
          },
          error: (err: any) => console.error('Fallback probe failed', err),
        });
      }

      this.connected = true;
    } catch (err) {
      console.error('Invalid token:', err);
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.messages = [];
    this.chatService.joinChat(user.chatId);
    this.chatService.getMessages(user.chatId).subscribe({
      next: (msgs) => {
        this.messages = msgs || [];
        this.chatService.setHistory(this.messages);
        this.scrollToBottom();
        this.chatService.markRead(user.chatId).subscribe({ next: () => {}, error: () => {} });
        this.users = (this.users || []).map((u) => (u.chatId === user.chatId ? { ...u, unreadCount: 0 } : u));
      },
      error: (err: any) => console.error('Failed to load messages', err),
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser) {
      const senderRole = this.currentUser?.role === 'Customer' ? 'Customer' : 'Company';
      this.chatService.sendMessage({
        chatId: this.selectedUser.chatId,
        content: this.newMessage,
        senderRole,
      });
      this.newMessage = '';
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const box = document.getElementById('chat-box');
      if (box) box.scrollTop = box.scrollHeight;
    }, 100);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }
  }

  private startAgentPolling(): void {
    if (this.refreshHandle) return;
    this.refreshHandle = setInterval(() => {
      const roleLower = (this.currentUser?.role || '').toString().toLowerCase();
      const isCompanyAgent = roleLower === 'admin' || roleLower === 'worker';
      if (!isCompanyAgent) return;
      this.chatService.getChats().subscribe({
        next: (chats: any[]) => {
          const mapped = (chats || [])
            .map((c: any) => {
              const customer = (c?.participants || []).find((p: any) => p.role === 'Customer');
              return customer ? { chatId: c._id, username: customer.username, unreadCount: c.unreadCount || 0 } : null;
            })
            .filter((x: any) => !!x);
          const selectedId = this.selectedUser?.chatId;
          this.users = mapped.map((u: any) => (u.chatId === selectedId ? { ...u, unreadCount: 0 } : u));
        },
        error: () => {},
      });
    }, 10000);
  }
}
