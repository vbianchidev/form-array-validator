import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { group } from 'console';
import { format } from 'path';

import { TimeRangeValidator } from './validators/period-range.validator';
import { ScheduleConflictValidator } from './validators/schedule-conflict.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  myForm: FormGroup = this._fb.group({
    name: ['Teste', Validators.required],
    schedules: this._fb.array([], [
      ScheduleConflictValidator() as ValidatorFn
    ])
  });

  days = [
    { id: 1, name: 'Monday'    },
    { id: 2, name: 'Tuesday'   },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday'  },
    { id: 5, name: 'Friday'    },
    { id: 6, name: 'Saturday'  },
    { id: 0, name: 'Sunday'    }
  ];
  
  constructor(private _fb: FormBuilder) {}

  get schedulesArray() {
    return this.myForm.controls["schedules"] as FormArray;
  }

  scheduleFormMock(): FormGroup {
    return this._fb.group({
      daysOfWeek: [null, [Validators.required, Validators.pattern('.+')]],
      initialTime: ['00:00', Validators.required],
      finalTime: ['12:00', Validators.required]
    });
  }

  addSchedule(): void {
    const scheduleForm = this.scheduleFormMock();
    this.schedulesArray.push(scheduleForm);
  }

  deleteSchedule(index: number): void {
    this.schedulesArray.removeAt(index);
  }

  save(): void {
    console.log(this.myForm.valid);
  }
}
