import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../services/tour.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-participants',
    standalone: true,
    imports: [FormsModule, MessageBoxComponent, ReactiveFormsModule, RouterLink],
    templateUrl: './participants.component.html',
    styleUrl: './participants.component.css'
})
export class ParticipantsComponent {

    @ViewChild('participantModal') myModal: any;
    @ViewChild(MessageBoxComponent) meesageBox!: MessageBoxComponent


    loadingData: boolean = false;

    participants: any;

    participantForm = new FormGroup({
        arrival: new FormControl<Date | ''>(''),
        departure: new FormControl<Date | ''>(''),
        id: new FormControl(''),
        name: new FormControl(''),
        things: new FormControl(''),
    });

    constructor(
        private route: ActivatedRoute, 
        private tourService: TourService
    ) {}

    private modalService = inject(NgbModal);
	closeResult = '';

    ngOnInit() {
        this.getParticipants();
    }

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

    initializeModal(participantID: string) {
        let participantsMap = this.participants.reduce((obj: any, cur: any) => ({...obj, [cur.id]: cur}), {})
        console.log("participantsMap", participantsMap)

        let values = {
            arrival: participantsMap[participantID]['arrival'],
            departure: participantsMap[participantID]['departure'],
            id: participantID,
            name: participantsMap[participantID]['name'],
            things: participantsMap[participantID]['burdens'],
        }

        

        this.participantForm.setValue(values)

        this.open(this.myModal)
    }

    getParticipants() {
        this.loadingData = true;
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            this.participants = response.participants;
            this.loadingData = false;
            console.log('Teilnehmer abrufen - success', this.participants);
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('Teilnehmer abrufen - error', error);
        });
    }

    addParticipant() {
        this.loadingData = true;
        console.log(this.participantForm)
        this.tourService.post('participants', this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.participants = response;
            this.getParticipants()
            console.log('Teilnehmer hinzufügen- success', this.participants);
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('Teilnehmer hinzufügen- error', error);
        });
    }

    editParticipant() {
        console.log(this.participantForm)
        this.tourService.put('participants/' + this.participantForm.get('id')!.value, this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.participants = response;
            this.getParticipants()
            console.log('Edit participant - success', this.participants);
        })
        .catch((error) => {
            console.error('Edit participant - error', error);
        });
    }

    deleteParticipant(participantID: string) {
        this.tourService.delete('participants/' + participantID)
        .toPromise()
        .then((response) => {
            this.participants = response;
            this.getParticipants()
            console.log('Add participant - success', this.participants);
        })
        .catch((error) => {
            console.error('Add participant - error', error);
        });
    }
}
