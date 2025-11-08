import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../services/login.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoginService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: LoginService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage on login failure', () => {
    loginService.login.and.returnValue(throwError(() => ({ error: 'Invalid credentials' })));
    component.username = 'test';
    component.password = 'wrong';
    component.onLogin();
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should call loginService on login', () => {
    loginService.login.and.returnValue(of({ token: 'abc', role: 'Customer' }));
    component.username = 'test';
    component.password = '1234';
    component.onLogin();
    expect(loginService.login).toHaveBeenCalledWith('test', '1234');
  });
});
