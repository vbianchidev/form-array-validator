import { Time } from '@angular/common';
import { FormGroup } from '@angular/forms';

export function stringToTime(time: string): Time {
  const [hours, mins] = time.split(':');
  return { hours: parseInt(hours), minutes: parseInt(mins) } as Time;
}

export function TimeRangeValidator(controlNameStart: string, controlNameEnd: string) {
  return (fg: FormGroup): { [Key: string]: any; } | null => {
    const start = stringToTime(fg.get(controlNameStart)?.value);
    const end   = stringToTime(fg.get(controlNameEnd)?.value);

    if(start.hours < end.hours) {
      return null;
    }

    if((start.hours  === end.hours) &&  (start.minutes < end.minutes)) {
      return null;
    }
    
    return { timeRange: 'Conflict' };
  };
}