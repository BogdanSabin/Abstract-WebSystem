import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Output() showCategoryEvent = new EventEmitter<string>();

  @Input() categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  showCategory(category: string): void {
    this.showCategoryEvent.emit(category);
  }

}