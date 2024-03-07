import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DatePickerComponent, FormsModule, ReactiveFormsModule, RouterLink, NgbTypeaheadModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    newParticipant: any;
    participantsMap: Array<any> = [];
    tours: Array<any> = [];

    constructor(
        private tourService: TourService
    ) {}

    private modalService = inject(NgbModal);
	closeResult = '';

	open(tourModal: TemplateRef<any>) {
		this.modalService.open(tourModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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

    tourForm = new FormGroup({
        name: new FormControl(''),
        start: new FormControl<Date | null>(null),
        participants: new FormControl(''),
        end: new FormControl<Date | null>(null)
    });

    ngOnInit() {
        this.getTours()
        this.getParticipants()
    }

    getTours(){
        this.tourService.get('tours')
        .toPromise()
        .then((response) => {
            this.tours = response.tours;
            console.log('Daten abgerufen:', this.tours);
        })
        .catch((error) => {
            console.error('Fehler beim Abrufen der Daten:', error);
        });
    }

    getParticipants() {
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            this.participantsMap = response.participants;
            console.log('getParticipants - success', this.participantsMap);
            // for (var i = 0; i < participants.length; i++) {
            //     var name = participants[i].name;
            //     this.participantsMap[name] = participants[i];
            // }

        })
        .catch((error) => {
            console.error('getParticipants - error', error);
        });
    }

    newTour() {
        console.log("tourForm", this.tourForm.value)
        this.tourService.post('tours', this.tourForm)
        .toPromise()
        .then((response) => {
            console.log('newTour - success', response);
        })
        .catch((error) => {
            console.error('newTour - error', error);
        });
        console.log("tours", this.tours)
    }

    search: OperatorFunction<string, readonly { name: string }[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term) =>
				term === ''
					? []
					: this.participantsMap.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

        formatter = (x: { name: string }) => x.name;


}
