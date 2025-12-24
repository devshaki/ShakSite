import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchTerm: string, ...properties: (keyof T)[]): T[] {
    if (!items || !searchTerm || properties.length === 0) {
      return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter(item => {
      return properties.some(prop => {
        const value = item[prop];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }
}
