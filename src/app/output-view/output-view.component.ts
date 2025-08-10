import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-output-view',
  standalone: true,
  imports: [
    MatExpansionModule,
  ],
  templateUrl: './output-view.component.html',
  styleUrl: './output-view.component.scss'
})
export class OutputViewComponent {
  @Input() serverResponse!:string;
}
