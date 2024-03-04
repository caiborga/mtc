import { Component, inject, TemplateRef } from '@angular/core';
import { CommonModule } from "@angular/common"

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';

import { foodUnits } from '../../../models/units';

interface NewIngredient {
	name: string;
	unit: string,
	quantity: number;
}

@Component({
    selector: 'app-meal',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbNavModule, NgbTypeaheadModule, ReactiveFormsModule],
    templateUrl: './meal.component.html',
    styleUrl: './meal.component.css'
})

export class MealComponent {
    ingredients: Array<any> = []
	meals: Array<any> = [
		{
			name: "Reis mit Scheiß",
			persons: 4,
			ingredients: [
				{
					name: "Reis",
					quantity: "1",
					unit: {
						id: 2,
						unit: "Kilogramm (kg)"
					}
				},
				{
					name: "Scheiß",
					quantity: "2",
					unit: {
						id: 9,
						unit: "Becher"
					}
				},
				{
					name: "Streusel",
					quantity: "20",
					unit: {
						id: 1,
						unit: "Gramm (g)"
					}
				}
			]
			

		}

	]
	mealIngredients: Array<any> = []
	mealName: string = 'Neues Gericht'

	newIngredient: NewIngredient = {
		name: '',
		unit: '',
		quantity: 0,
	}

    private modalService = inject(NgbModal);
	closeResult = '';

    mealForm = new FormGroup({
        name: new FormControl('Neues Gericht', Validators.required),
		persons: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]*$")])
    });

    ngOnInit () {
        this.ingredients = [];
		this.mealIngredients = [];
    }

	open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

    private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

	addMealIngrident() {
		let temp = {
			name: this.newIngredient.name,
			unit: this.newIngredient.unit,
			quantity: this.newIngredient.quantity
		}
		this.newIngredient.name = ''
		this.newIngredient.quantity = 0
		this.newIngredient.unit = ''

		this.mealIngredients.push(temp)
	}

	addMeal() {
		let newMeal = {
			name: this.mealForm.get('name')?.value,
			persons: this.mealForm.get('persons')?.value,
			ingredients: this.mealIngredients
		}

		this.meals.push(newMeal)
		console.log("meals", this.meals)

	}

	search: OperatorFunction<string, readonly { unit: string }[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			filter((term) => term.length >= 1),
			map((term) => foodUnits.filter((units) => new RegExp(term, 'mi').test(units.unit)).slice(0, 10)),
		);
		
	formatter = (x: { unit: string }) => x.unit;
}
