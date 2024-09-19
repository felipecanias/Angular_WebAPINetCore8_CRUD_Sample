import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; 
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: ComponentFixture<AddemployeeComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AddemployeeComponent],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 1 })
          }
        },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if name is less than 2 characters', () => {
    component.newEmployee.name = 'A';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('The name must be at least 2 characters long.');
  });

  it('should display error if name contains numbers', () => {
    component.newEmployee.name = 'John1 Doe'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('The name cannot contain numbers.');
  });

  it('should display error if name exceeds 100 characters', () => {
    component.newEmployee.name = 'A'.repeat(101); 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('The name cannot exceed 100 characters.');
  });

  it('should display error if name contains excessive repetition', () => {
    component.newEmployee.name = 'Juuuuaannn'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('The name contains excessive repetition of characters.');
  });

  it('should display error if name contains invalid special characters', () => {
    component.newEmployee.name = 'John@ Doe'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('The name contains invalid characters.');
  });

  it('should not display errors for valid name', () => {
    component.newEmployee.name = 'John Doe'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).not.toHaveBeenCalled();
  });
});