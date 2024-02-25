import { Component, inject, TemplateRef } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { MealComponent } from './meal/meal.component';

const things = [
    {
        name: 'Nudeln',
        category: 'food',
        perPerson: 167,
        unit: 'g'
    },
    {
        name: 'Reis',
        category: 'food',
        perPerson: 100,
        unit: 'g'
    },
    {
        name: 'Joghurt',
        category: 'food',
        perPerson: 66.66,
        unit: 'g',
    },
    {
        name: 'Bose Box',
        category: 'non-consumables',
        perPerson: 680,
        unit: 'g'
    },
    {
        name: 'Klopapier',
        category: 'consumables',
        perPerson: 0.33,
        unit: 'Rolle'
    },
]

@Component({
    selector: 'app-things',
    standalone: true,
    imports: [MealComponent, RouterLink, NgbNavModule],
    templateUrl: './things.component.html',
    styleUrl: './things.component.css'
})
export class ThingsComponent {
    activeTab = 0   ;
    things: Array<any> = things

    private modalService = inject(NgbModal);
	closeResult = '';

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

    addThing() {
    }
}
