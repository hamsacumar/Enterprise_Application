import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  text: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = signal<AppNotification[]>([]);
  private idSeq = 1;

  notifications() { return this._notifications(); }

  unreadCount(): number { return this._notifications().filter(n => !n.read).length; }

  add(text: string, data?: any) {
    const id = this.idSeq++;
    const n: AppNotification = { id, text, read: false, createdAt: new Date(), data };
    this._notifications.set([n, ...this._notifications()]);
    return id;
  }

  markAllRead() {
    this._notifications.set(this._notifications().map(n => ({ ...n, read: true })));
  }

  remove(id: number) {
    this._notifications.set(this._notifications().filter(n => n.id !== id));
  }
}
