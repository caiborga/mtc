import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-participant',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './add-participant.component.html',
    styleUrl: './add-participant.component.css'
})

export class AddParticipantComponent {

    @Input() editParticipantInput: any;
    @Output() reloadData = new EventEmitter();
    @ViewChild('content') contentTemplate!: TemplateRef<any>;

    loadingData: boolean = false;

    participants: any;

    participantForm = new FormGroup({
        avatar: new FormControl(''),
        id: new FormControl(''),
        name: new FormControl(''),
    });

    private modalService = inject(NgbModal);

    constructor(
        private tourService: TourService,
    ) {}

    ngOnChanges(changes: any) {
        console.log("ngOnChanges", changes)
        if ( !changes.editParticipantInput.firstChange ) {
            this.participantForm.setValue(changes.editParticipantInput.currentValue)
            this.openModal(this.contentTemplate)
        }
    }

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
	}

    addParticipant() {
        let avatar = this.generateAvatarNumber()
        this.participantForm.get('avatar')?.setValue(String(avatar))
        this.loadingData = true;
        this.tourService.post('participants', this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.participants = response;
            console.log('Teilnehmer hinzufügen- success', this.participants);
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('Teilnehmer hinzufügen- error', error);
        });
        this.reloadData.emit()
    }

    generateAvatarNumber(): number {
        let min = 1
        let max = 16
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    editParticipant() {
        console.log(this.participantForm)
        this.tourService.put('participants/' + this.participantForm.get('id')!.value, this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.participants = response;
            this.reloadData.emit();
            console.log('Edit participant - success', this.participants);
        })
        .catch((error) => {
            console.error('Edit participant - error', error);
        });
    }
}
