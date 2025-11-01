import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassifyComponent } from './classify.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ClassifyService } from '../../services/classify.service';
import { of, throwError } from 'rxjs';

describe('ClassifyComponent', () => {
  let component: ClassifyComponent;
  let fixture: ComponentFixture<ClassifyComponent>;
  let classifyService: jasmine.SpyObj<ClassifyService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ClassifyService', ['classify']);

    await TestBed.configureTestingModule({
      imports: [ClassifyComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: ClassifyService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassifyComponent);
    component = fixture.componentInstance;
    classifyService = TestBed.inject(ClassifyService) as jasmine.SpyObj<ClassifyService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set successMessage on classify success', () => {
    classifyService.classify.and.returnValue(of({ message: 'Details updated' }));
    component.username = 'user1';
    component.onClassify();
    expect(component.successMessage).toBe('Details updated');
  });

  it('should set errorMessage on classify failure', () => {
    classifyService.classify.and.returnValue(throwError(() => ({ error: 'Failed' })));
    component.username = 'user1';
    component.onClassify();
    expect(component.errorMessage).toBe('Failed');
  });
});
