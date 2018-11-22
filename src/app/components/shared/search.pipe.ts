import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(applications: any[], searchText: string): any[] {
    if (!applications) return [];
    if (!searchText) return applications;

    searchText = searchText.toLowerCase();

    return applications.filter(it => {
      return it.applicationName.toLowerCase().includes(searchText);
    });
  }

}
