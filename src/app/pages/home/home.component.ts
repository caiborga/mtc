import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel } from '@angular/forms';
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

    newParticipants: Array<any> = [];
    participantsMap: Array<any> = [];
    tours: Array<any> = [];

    // @ViewChild('input') inputField: NgModel | null = null;
    @ViewChild('input') inputField!: NgModel;


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
        start: new FormControl(''),
        end: new FormControl(''),
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
            console.log('getTours - success:', this.tours);
            for (let tour in this.tours) {
                let participants = this.tours[tour].participants.replace(/"/g, '').split(',');
                this.tours[tour].participants = participants
            }
            
        })
        .catch((error) => {
            console.error('getTours - error:', error);
        });
    }

    getParticipants() {
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            //this.participantsMap = response.participants;
            console.log('getParticipants - success', this.participantsMap);
            for (var i = 0; i < response.participants.length; i++) {
                var id = response.participants[i].id;
                this.participantsMap[id] = response.participants[i];
            }
            console.log("participantsMap", this.participantsMap)

        })
        .catch((error) => {
            console.error('getParticipants - error', error);
        });
    }

    newTour() {
        const data = {
            name: this.tourForm.get('name')!.value,
            start: this.tourForm.get('start')!.value,
            end: this.tourForm.get('end')!.value,
            participants: this.newParticipants.toString(),
        };
        console.log("tourForm", data)
        this.tourService.post('tours', data)
        .toPromise()
        .then((response) => {
            this.getTours()
            console.log('newTour - success', response);
        })
        .catch((error) => {
            console.error('newTour - error', error);
        });
        console.log("tours", this.tours)
    }

    searchParticipants: OperatorFunction<string, readonly { name: string }[]> = (text$:  Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term) =>
				term === ''
					? []
					: this.participantsMap.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

    getParticipantName = (x: { id: string }) => x.id;

    getParticipantID = (x: { name: string }) => x.name;

    addParticipant(participantID: any){

        // Dynamisch den Eigenschaftsnamen hinzufügen
        this.newParticipants[participantID.item.id] = {
            id: participantID.item.id,
            start: this.tourForm.get('start')!.value,
            end: this.tourForm.get('end')!.value,
        };
        console.log(this.newParticipants);
        
    }

    removeParticipant(participantID: any) {
        const index = this.newParticipants.indexOf(participantID);
        if (index !== -1) {
            this.newParticipants.splice(index, 1);
        }
    }

    deleteTour(tourID: string) {
        this.tourService.delete('tours/' + tourID)
        .toPromise()
        .then((response) => {
            this.getTours()
            console.log('Delete tour - success', response);
        })
        .catch((error) => {
            console.error('Delete tour - error', error);
        });
    }
}
