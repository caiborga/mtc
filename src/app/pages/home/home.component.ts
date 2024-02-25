import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

const tourenArray = [
    {
        id: 1,
        name: 'Bichlhütte',
        from: '01.01.2023',
        participants: [ 'Sören', 'Sybille', 'Thomas'],
        to: '03.01.2023',
    },
    {
        id: 2,
        name: 'Almhüte',
        participants: [ 'Ruth', 'Megan', 'Oliver'],
        from: '01.04.2023',
        to: '04.04.2023',
    }
]

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    tours: Array<any> = [];

    tourForm = new FormGroup({
        name: new FormControl(''),
        from: new FormControl<Date | null>(null),
        participants: new FormControl(''),
        to: new FormControl<Date | null>(null)
    });

    ngOnInit() {
        this.tours = tourenArray;
    }

    newTour() {
        this.tours.push(this.tourForm.value)
        console.log("tours", this.tours)
    }

}
