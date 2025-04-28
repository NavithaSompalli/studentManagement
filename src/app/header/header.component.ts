import { Component, Input,Output,EventEmitter} from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent {
//@Input() selectedComponent:any;
  @Output() notifyParent = new EventEmitter<string>();
  selectedComponent: string;

 loadComponent(component: string){
  this.notifyParent.emit(component);
  this.selectedComponent = component;
 }
}
