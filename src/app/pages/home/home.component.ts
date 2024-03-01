import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    tours: Array<any> = [];

    constructor(private tourService: TourService) { }

    tourForm = new FormGroup({
        name: new FormControl(''),
        from: new FormControl<Date | null>(null),
        participants: new FormControl(''),
        to: new FormControl<Date | null>(null)
    });

    ngOnInit() {
        this.tourService.get()
        .toPromise()
        .then((response) => {
          // Daten erfolgreich abgerufen
          this.tours = response;
          console.log('Daten abgerufen:', this.tours);
  
          // Fügen Sie hier weiteren Code hinzu, der auf die abgerufenen Daten zugreift.
          this.weitererCode();
        })
        .catch((error) => {
          // Fehler bei der Anfrage
          console.error('Fehler beim Abrufen der Daten:', error);
        });
    }
  
    weitererCode(): void {
      // Ihr weiterer Code, der auf die abgerufenen Daten zugreift
      console.log('Weiterer Code, der auf die Daten zugreift:', this.tours);
    }

    newTour() {
        this.tours.push(this.tourForm.value)
        console.log("tours", this.tours)
    }

}
