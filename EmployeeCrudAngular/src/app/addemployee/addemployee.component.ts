import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee(0, '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if(employeeId)
      this.editEmployee(employeeId);
    });
  }

  addEmployee(employee: Employee) {

    if (employee.name.length > 100) {
      this.toastr.error('The name cannot exceed 100 characters.');
      return;
    }

    if (employee.name.trim().length < 2) {
      this.toastr.error('The name must be at least 2 characters long.');
      return;
    }

    const excessiveRepetitionRegex = /(.)\1{2,}/; 
    if (excessiveRepetitionRegex.test(employee.name)) {
      this.toastr.error('The name contains excessive repetition of characters.');
      return;
    }

    const numberRegex = /\d/;
    if (numberRegex.test(employee.name)) {
      this.toastr.error('The name cannot contain numbers.');
      return;
    }

    const validNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´]+$/; 
    if (!validNameRegex.test(employee.name)) {
      this.toastr.error('The name contains invalid characters.');
      return;
    }

    if (employee.id == 0) {
      employee.createdDate = new Date().toISOString();
      this.employeeService.createEmployee(employee).subscribe(result => this.router.navigate(['/']));
    }
    else {
      employee.createdDate = new Date().toISOString();
      this.employeeService.updateEmployee(employee).subscribe(result => this.router.navigate(['/']));
    }
    
    this.submitBtnText = "";
    this.imgLoadingDisplay = 'inline';
  }


  editEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
