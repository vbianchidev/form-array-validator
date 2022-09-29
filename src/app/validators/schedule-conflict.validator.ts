import { Time } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { stringToTime } from './period-range.validator';


interface ScheduleMock {
  dayOfWeek: number;
  initialTime: Time;
  finalTime: Time;
}

function isGreaterOrEqual(element: Time, compare: Time): boolean {
  return (element.hours > compare.hours) || ((element.hours === compare.hours) && (element.minutes >=  compare.minutes));
}

function isLessOrEqual(element: Time, compare: Time): boolean {
  return (element.hours < compare.hours) || ((element.hours === compare.hours) && (element.minutes <=  compare.minutes));
}

function hasConflict(schedules: ScheduleMock[]): boolean {
  let valid: boolean = false;
  schedules.map(schedule => {
    const temp = schedules.filter(item => item !== schedule)

    for(let compare of temp) {
      valid = 
        isGreaterOrEqual(schedule.finalTime,   compare.finalTime)   && isLessOrEqual(schedule.initialTime, compare.initialTime) ||
        isGreaterOrEqual(schedule.initialTime, compare.initialTime) && isLessOrEqual(schedule.initialTime, compare.finalTime  ) ||
        isGreaterOrEqual(schedule.finalTime,   compare.initialTime) && isLessOrEqual(schedule.finalTime  , compare.finalTime  ) ||
        isGreaterOrEqual(schedule.initialTime, compare.initialTime) && isLessOrEqual(schedule.finalTime  , compare.finalTime  ) 
    }
  })
  return valid;
}

export function ScheduleConflictValidator() {
  return (fa: FormArray): ValidationErrors | null => {
    let hasError: boolean = false;
    let schedulesPool: ScheduleMock[] = [];

    fa.controls.forEach((group: FormGroup | AbstractControl) => {
      const days: number[] = group.get("daysOfWeek")?.value;
      const start = stringToTime(group.get("initialTime")?.value);
      const end   = stringToTime(group.get("finalTime")?.value);

      const groupPool: ScheduleMock[] = [];

      if(days) { 
        days.map(day => groupPool.push({
          dayOfWeek: day,
          initialTime: start,
          finalTime: end
        }));

        schedulesPool = [...schedulesPool, ...groupPool]

        groupPool.map(item => {
          let conflictedItems = schedulesPool.filter(schedule => schedule.dayOfWeek === item.dayOfWeek)
      
          hasError = hasConflict(conflictedItems);
          if(conflictedItems.length > 0 && hasConflict(conflictedItems)) {
            group.get("daysOfWeek")?.setErrors({ scheduleConflict: 'Conflict' });
            group.get("initialTime")?.setErrors({ scheduleConflict: 'Conflict' });
            group.get("finalTime")?.setErrors({ scheduleConflict: 'Conflict' });
            group.markAllAsTouched();

            return { scheduleConflict: 'Conflict' };
          } else { 
            group.get("daysOfWeek")?.setErrors(null);
            group.get("initialTime")?.setErrors(null);
            group.get("finalTime")?.setErrors(null);
            group.markAllAsTouched();

            return null
          }
        })
      }
    });

    return hasError ? { scheduleConflict: 'Conflict' } : null;
  }
}