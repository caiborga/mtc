import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { foodUnits } from '../../models/units';

@Component({
    selector: 'app-unit-picker',
    standalone: true,
    imports: [FormsModule, NgbTypeaheadModule],
    templateUrl: './unit-picker.component.html',
    styleUrl: './unit-picker.component.css'
})

export class UnitPickerComponent {

    @Input() unitInput: string = 'Suche..';
    @Output() unitOutput = new EventEmitter<string>();
    selectedUnit: string = '';

    search: OperatorFunction<string, readonly { unit: string }[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			filter((term) => term.length >= 1),
			map((term) => foodUnits.filter((units) => new RegExp(term, 'mi').test(units.unit)).slice(0, 10)),
		);

    setUnit() {
        this.unitOutput.emit(this.selectedUnit);
    }
		
	formatter = (x: { unit: string }) => x.unit;

}
