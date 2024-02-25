import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { ActivatedRoute } from '@angular/router';


// API Abfrage einer bestimmten Tour mit ID x
const tour = {
    id: 1,  
    name: 'Bichlhütte',
    from: '01.01.2023',
    participants: [ 'Sören', 'Sybille', 'Thomas', 'Herbert', 'Paul', 'Tine'],
    to: '03.01.2023',
    things: ['Bose Box', 'Nudeln', 'Reis', 'Essig', 'Schockolade', 'Penis', 'Taschentücher'],
    meals: [
        {
            type: 'dinner',
            meal: 'Reis mit Scheiß',
            date: '01.03.2023',
        },
        {
            type: 'breakfast',
            meal: 'Müsli',
            date: '02.03.2023',
        },
        {
            type: 'dinner',
            meal: 'NumiPe',
            date: '02.03.2023',
        },
        {
            type: 'breakfast',
            meal: 'Müsli',
            date: '03.03.2023',
        },
    ],
}

interface Meal {
    type: string,
    meal: string,
    date: string
}

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [
        CommonModule, 
        DatePickerComponent, 
        FormsModule,
        NgbAccordionModule,
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.css'
})
export class PlannerComponent {

    dinnerImage = 'https://i1.wp.com/www.voi-lecker.de/wp-content/uploads/2021/07/Italienisches-Menue.jpg?fit=1200%2C800&ssl=1'
    breakfastImage = 'https://www.vitalaire.de/sites/default/files/styles/small_x1/public/2023-07/Original_Gesundes%20Fr%C3%BChst%C3%BCck_Article_800x542.jpg?itok=YYbLgz7K'

    isCollapsed = true;

    tourData = tour;
    tourID: number = 0;
    newParticipant: string = '';
    participants: Array<string> = [];
    things: Array<string> = [];
    meals: Array<Meal> = [];
    private sub: any;
    private offcanvasService = inject(NgbOffcanvas);
	closeResult = '';

    tourForm = new FormGroup({
        name: new FormControl(''),
        from: new FormControl<Date | null>(null),
        participants: new FormControl(''),
        to: new FormControl<Date | null>(null)
    });

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.tourID = + params['id'];
        });
        this.participants = tour.participants;
        this.things = tour.things;
        this.meals = tour.meals;
        //Suche nach Element mit KEY x
        //this.participants = tour[this.tourID as keyof typeof tour].participants;
    }

    addParticipant() {
        this.participants.push(this.newParticipant)
    }

    setParticipants(tour: any) {
        this.participants = tour.participants;
    }

    open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
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
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
