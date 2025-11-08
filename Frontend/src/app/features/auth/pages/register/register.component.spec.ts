import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterService } from '../../services/regiser.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerService: jasmine.SpyObj<RegisterService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RegisterService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: RegisterService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerService = TestBed.inject(RegisterService) as jasmine.SpyObj<RegisterService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set successMessage on successful registration', () => {
    registerService.register.and.returnValue(of({ message: 'OTP sent to email' }));
    component.username = 'test';
    component.firstName = 'Test';
    component.lastName = 'User';
    component.email = 'test@example.com';
    component.password = '1234';
    component.onRegister();
    expect(component.successMessage).toBe('OTP sent to email');
  });

  it('should set errorMessage on registration failure', () => {
    registerService.register.and.returnValue(throwError(() => ({ error: 'Username exists' })));
    component.username = 'test';
    component.firstName = 'Test';
    component.lastName = 'User';
    component.email = 'test@example.com';
    component.password = '1234';
    component.onRegister();
    expect(component.errorMessage).toBe('Username exists');
  });
});
