import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { FormsModule } from '@angular/forms';
import { Participant } from '../planner.component';
import { TourService } from '../../../core/services/tour.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Message, MessageBoxComponent } from '../../../shared/message-box/message-box.component';

interface Car {
    seats?: Number,
    type?: String,
    passengers: Number[]
}

@Component({
    selector: 'app-carsharing',
    standalone: true,
    imports: [DragDropModule, FormsModule, MessageBoxComponent, NgbTooltipModule],
    templateUrl: './carsharing.component.html',
    styleUrl: './carsharing.component.css'
})
export class CarsharingComponent {

    @Input() participantsMap: any;
    @Input() tourCars: any;
    @Input() tourID: number = -1;
    @Input() tourParticipants: any;
    @Input() showElement: boolean = true;
    @Output() showMessageBox = new EventEmitter();
    @Output() reloadData = new EventEmitter();
    @Output() showElementChange = new EventEmitter<boolean>();

    @ViewChild(MessageBoxComponent) messageBox:MessageBoxComponent = new MessageBoxComponent;

    carCount: number = 0;
    draggedParticipant: number | null = null
    selectedParticipants: Array<String> = [];

    constructor(
        private tourService: TourService,
    ) {}

    ngOnInit() {

        this.carCount = this.tourCars.length;

        for (let car in this.tourCars) {
            for (let passenger in this.tourCars[car].passengers) {
                let draggedParticipantIndex = this.findIndex(this.tourCars[car].passengers[passenger].valueOf());
                this.tourParticipants = this.tourParticipants?.filter((val: any, i: any) => i != draggedParticipantIndex);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tourCars']) {
            this.tourCars = changes['tourCars'].currentValue
        }
        if (changes['tourParticipants']) {
            this.tourParticipants = changes['tourParticipants'].currentValue
        }
    }

    convertStrToInt(input: String) : number {
        return Number(input)
    }

    dragStart(participant: number) {
        this.draggedParticipant = participant;
    }

    drop(car: number) {
        if (this.draggedParticipant) {
            let draggedParticipantIndex = this.findIndex(this.draggedParticipant);
            this.tourCars[car].passengers.push(Number(this.draggedParticipant))
            this.tourParticipants = this.tourParticipants?.filter((val: any, i: any) => i != draggedParticipantIndex);
            this.draggedParticipant = null;

            this.editTourCars()
        }
    }

    dragEnd() {
        this.draggedParticipant = null;
    }

    findIndex(participantID: number) {
        let index = -1;
        for (let i = 0; i < this.tourParticipants.length; i++) {
            if (participantID == (this.tourParticipants as Participant[])[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }

    setCarCount(modus: string) {
    
        if ( modus === 'increment') {
            let newCar = {
                passengers: []
            }
            this.tourCars.push(newCar)
            this.editTourCars()
        }
        if ( modus === 'decrement') {
            console.log("tourCars.length", this.tourCars.length)
            if ( this.tourCars.length > 0 && this.tourCars[this.tourCars.length - 1].passengers.length == 0 ) {
                this.tourCars.pop()
                this.editTourCars()
            } else {
                let message: Message = {
                    type: 'warning',
                    message: `Da eine Zuweisung besteht, kann Auto ${this.tourCars.length} nicht gelöscht werden!`
                }
                this.showMessageBox.emit(message)
            }
        }
    }

    editTourCars() {
        const data = {
            tourCars: JSON.stringify(this.tourCars),
        };

        this.tourService.put('tour/' + this.tourID + '/cars', data)
        .toPromise()
        .then((response) => {
            console.log('editTourCars - success', response);
        })
        .catch((error) => {
            console.error('editTourCars - error', error);
        });

        this.reloadData.emit()
    }
}
