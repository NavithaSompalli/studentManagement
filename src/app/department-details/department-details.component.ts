import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.css',
  standalone:false
})
export class DepartmentDetailsComponent {
  @Input() selectedDepartment: any; // Receive selected department
  @Input() visible: boolean = false; // Receive dialog visibility state
}
