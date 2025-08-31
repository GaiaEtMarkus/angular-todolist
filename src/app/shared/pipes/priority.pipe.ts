import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(priority: 'low' | 'medium' | 'high'): string {
    const priorityMap: Record<string, string> = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Haute',
    };

    return priorityMap[priority] || priority;
  }
}
