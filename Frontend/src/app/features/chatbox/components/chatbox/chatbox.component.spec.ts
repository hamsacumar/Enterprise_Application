import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatboxComponent } from './chatbox.component';
import { ChatService } from '../../services/chat.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChatboxComponent', () => {
  let component: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChatboxComponent],
      providers: [ChatService],
      schemas: [NO_ERRORS_SCHEMA], // ignore template/style parsing
    }).compileComponents();

    fixture = TestBed.createComponent(ChatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
