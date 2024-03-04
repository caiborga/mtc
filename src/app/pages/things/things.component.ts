import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { MealComponent } from './meal/meal.component';
import { ThingComponent } from './thing/thing.component';

const things = [
    {
        name: 'Nudeln',
        category: 'food',
        perPerson: 167,
        unit: 'g',
        weight: 0
    },
    {
        name: 'Reis',
        category: 'food',
        perPerson: 100,
        unit: 'g',
        weight: 0

    },
    {
        name: 'Joghurt',
        category: 'food',
        perPerson: 66.66,
        unit: 'g',
        weight: 0

    },
    {
        name: 'Bose Box',
        category: 'non-consumables',
        perPerson: 680,
        unit: 'g',
        weight: 0

    },
    {
        name: 'Klopapier',
        category: 'consumables',
        perPerson: 0.33,
        unit: 'Rolle',
        weight: 0
    },
]

export interface Thing {
    category: string,
    name: string,
    perPerson: Number,
    unit: string,
    weight: Number,
}

@Component({
    selector: 'app-things',
    standalone: true,
    imports: [
        MealComponent, 
        NgbNavModule,
        RouterLink, 
        ThingComponent,
    ],
    templateUrl: './things.component.html',
    styleUrl: './things.component.css'
})
export class ThingsComponent {
    activeTab = 0   ;
    things: Thing[] = things
    participantForm = new FormGroup({
        arrival: new FormControl<Date | ''>(''),
        departure: new FormControl<Date | ''>(''),
        name: new FormControl(''),
        things: new FormControl(''),
    });
}
