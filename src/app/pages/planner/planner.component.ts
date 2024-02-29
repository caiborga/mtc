import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, FormBuilder } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { ActivatedRoute } from '@angular/router';


// API Abfrage einer bestimmten Tour mit ID x
const tour = {
    breakfastCount: 2,
    dinnerCount: 2,
    from: '01.01.2023',
    id: 1,  
    name: 'Bichlhütte',
    to: '01.01.2023',
    participants: [ 
        { 
            id: '1',
            name: 'Sören'
        },
        { 
            id: '2',
            name: 'Thomas'
        },
        { 
            id: '3',
            name: 'Herbert'
        },
        { 
            id: '4',
            name: 'Paul'
        },
        {
            id: '5',
            name: 'Tine'
        },
    ],
    things: [
        {   
            id: '1',
            name: 'Bose Box',
            carrier: '' 
        },
        {
            id: '2',
            name: 'Nudeln',
            carrier: ''
        },
        {
            id: '3',
            name: 'Reis',
            carrier: ''
        } ,
        {
            id: '4',
            name: 'Essig', 
            carrier: ''
        },
        {
            id: '5',
            name: 'Schockolade',
            carrier: ''
        }, 
        {
            id: '6',
            name: 'Penis',
            carrier: ''
        },
        {
            id: '7',
            name: 'Taschentücher',
            carrier: '',
        }
    ],
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
    ]
}

interface Meal {
    type: string,
    meal: string,
    date: string
}

interface Participant {
    id: string,
    name: string,
    things: Array<Object>
}

interface Thing {
    id: string,
    name: string,
    carrier: string
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
    tableView = false;
    tourData = tour;
    tourID: number = 0;
    newParticipant: Participant = {
        id: '',
        name: '',
        things: []
    }
    participants: any;
    participantsMap: { [key: string]: Participant } = {};
    things: Array<Thing> = [];
    thingsMap: { [key: string]: Thing } = {};
    thingsForm = new FormGroup({
        things: this.formBuilder.array([])
    });
    meals: Array<Meal> = [];
    private sub: any;
    private offcanvasService = inject(NgbOffcanvas);
	closeResult = '';

    tourForm = new FormGroup({
        arrivalChecked: new FormControl(false),
        departureChecked: new FormControl(true),
        from: new FormControl<Date | null>(null),
        name: new FormControl(''),
        participants: new FormControl(''),
        to: new FormControl<Date | null>(null)
    });

    constructor(
        private route: ActivatedRoute, 
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.tourID = + params['id'];
        });
        this.participants = tour.participants;
        this.participantsMap = tour.participants.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
        this.things = tour.things;
        this.thingsMap = tour.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})

        this.meals = tour.meals;
        //Suche nach Element mit KEY x
        //this.participants = tour[this.tourID as keyof typeof tour].participants;
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

    dummy() {
        console.log("things",this.things)
    }

    assignThingTo(thingID: string, event: any){
        
        let carrier = ''
        let participantID = event.target.value
        if ( participantID != '') {
            carrier = this.participantsMap[participantID].name
        }

        this.thingsMap[thingID].carrier = carrier
        
        console.log("thing",this.thingsMap)
        console.log("participants",this.participants)
        
    }
}
