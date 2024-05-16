import { Component, HostListener, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'primeng/dragdrop';
import { FormsModule } from '@angular/forms';
import { Participant } from '../planner.component';
import { TourService } from '../../../core/services/tour.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps'

import { Message, MessageBoxComponent } from '../../../shared/message-box/message-box.component';

interface Car {
    seats?: Number,
    type?: String,
    passengers: Number[]
}

@Component({
    selector: 'app-carsharing',
    standalone: true,
    imports: [CommonModule, DragDropModule, FormsModule, GoogleMapsModule, MessageBoxComponent, NgbTooltipModule],
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
    elementOffsetTop: number = 0;
    isFixed: boolean = false;
    selectedParticipants: Array<String> = [];
    unassignedPassengers: Array<number> = [];


    center: google.maps.LatLngLiteral = {
        lat: 22.2736308,
        lng: 70.7512555
    };

    zoom = 10;

    @HostListener('window:scroll', ['$event'])
    onScroll(event: Event) {
        const topOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const viewportHeight = window.innerHeight;

        if (this.elementOffsetTop - topOffset < 0) {
            this.isFixed = true;
        } else {
            this.isFixed = false;
        }
    }

    constructor(
        private elementRef: ElementRef,
        private tourService: TourService,
        private mapsAPILoader: GoogleMapsModule
    ) {}


    ngOnInit() {

        this.carCount = this.tourCars.length;
        console.log("this.tourCars", this.tourCars)

        for (let participant in this.tourParticipants) {
            this.unassignedPassengers.push(this.tourParticipants[participant].id)
        }

        this.getUnassignedParticipants()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tourCars']) {
            this.tourCars = changes['tourCars'].currentValue
        }
        if (changes['tourParticipants']) {
            this.tourParticipants = changes['tourParticipants'].currentValue
            this.getUnassignedParticipants()

        }
        if (changes['participantsMap']) {
            this.tourParticipants = changes['participantsMap'].currentValue
        }
    }

    ngAfterViewInit() {
        this.recalculateOffsetTop();
    }

    convertStrToInt(input: String) : number {
        return Number(input)
    }

    dragStart(participantID: number) {
        this.draggedParticipant = participantID
        console.log("this.unassignedPassengers", this.unassignedPassengers)
        console.log("participant", participantID)
    }

    drop(car: number) {
        console.log("this.draggedParticipant", this.draggedParticipant)

        if (this.draggedParticipant) {
            let draggedParticipantIndex = this.findIndex(this.draggedParticipant);
            this.tourCars[car].passengers.push(this.draggedParticipant)
            this.unassignedPassengers = this.unassignedPassengers?.filter((i: any) => i != draggedParticipantIndex);
            this.draggedParticipant = null;
            this.editTourCars()
        }
    }

    dragEnd() {
        this.draggedParticipant = null;
        console.log("drag End", this.draggedParticipant )
    }

    editTourCars() {
        const data = {
            tourCars: JSON.stringify(this.tourCars),
        };

        this.tourService.put('tour/' + this.tourID + '/cars', data)
        .toPromise()
        .then((response) => {
            console.log('editTourCars - success', response);
            this.reloadData.emit()
        })
        .catch((error) => {
            console.error('editTourCars - error', error);
        });
    }

    findIndex(participantID: number) {
        let index = -1;
        for (let passenger in this.unassignedPassengers) {
            
            if (participantID == this.unassignedPassengers[passenger]) {
                index = this.unassignedPassengers[passenger];
                break;
            }
        }
        return index;
    }

    getUnassignedParticipants() {
        for (let car in this.tourCars) {
            for (let passenger in this.tourCars[car].passengers) {
                let passengerID = this.tourCars[car].passengers[passenger]
                for (let index in this.unassignedPassengers) {
                    if ( this.unassignedPassengers[index] == passengerID ) {
                        this.unassignedPassengers.splice(Number(index), 1);
                    }
                }
            }
        }
        console.log("getUnassignedParticipants this.unassignedPassengers", this.unassignedPassengers)
    }

    geocodeAddress(address: string) {
        const geocoder = new google.maps.Geocoder();
    
    }

    recalculateOffsetTop() {
        this.elementOffsetTop = this.elementRef.nativeElement.offsetTop;
    }

    setCarCount(modus: string) {
    
        if ( modus === 'increment') {
            let newCar = {
                passengers: []
            }
            this.tourCars.push(newCar)
            this.editTourCars()
            this.carCount = this.carCount + 1; 
        }
        if ( modus === 'decrement') {
            console.log("tourCars.length", this.tourCars.length)
            if ( this.tourCars.length > 0 && this.tourCars[this.tourCars.length - 1].passengers.length == 0 ) {
                this.tourCars.pop()
                this.editTourCars()
                this.carCount = this.carCount - 1; 
            } else {
                let message: Message = {
                    type: 'warning',
                    message: `Da eine Zuweisung besteht, kann Auto ${this.tourCars.length} nicht gelöscht werden!`
                }
                this.showMessageBox.emit(message)
            }
        }
    }

    removePassengerFromCar(participant: number, car: number) {
        this.unassignedPassengers.push(participant)
        this.tourCars[car].passengers.splice(participant, 1)
        for (let index in this.tourCars[car].passengers) {
            if ( this.tourCars[car].passengers[index] == participant ) {
                this.tourCars[car].passengers.splice(Number(index), 1);
            }
        }
    }
}
