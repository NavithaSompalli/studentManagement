import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortServiceService {

  private sortOrder = 1; // Default ascending

  sortData(data: any[], field: string, order?: number): any[] {
    this.sortOrder = order !== undefined ? order : (this.sortOrder * -1); // Toggle order if not provided

    return data.sort((a, b) => {
      return a[field] > b[field] ? this.sortOrder : -this.sortOrder;
    });
  }
}
