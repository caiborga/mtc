import { Component, EventEmitter, inject, Input, OnChanges, Output, TemplateRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TourService } from '../../../services/tour.service';
import { UnitPickerComponent } from '../../../shared/unit-picker/unit-picker.component';
import { CategoryData } from '../things.component';
import { foodUnits, Unit } from '../../../models/units';

@Component({
  selector: 'app-thing',
  standalone: true,
  imports: [ReactiveFormsModule, UnitPickerComponent],
  templateUrl: './thing.component.html',
  styleUrl: './thing.component.css'
})

export class ThingComponent implements OnChanges{
    
    @Input() data: CategoryData;
    @Output() reloadData = new EventEmitter();

    closeResult = '';
    thingForm = new FormGroup({
        category: new FormControl(''),
        name: new FormControl(''),
        perPerson: new FormControl(null), 
        unitID: new FormControl(0),
        weight: new FormControl(null),
    });

    
    selectedThingID: number = -1;
    thingsMap: any;
    foodUnits: any;

    private modalService = inject(NgbModal);
	
    constructor(
        private tourService: TourService
    ) {
        this.data = {
            category: '',
            relevantColumns: {
                name: true,
                perPerson: true,
                unit: true,
                weight: true,
            },
            things: [],
            title: '',
        }
    }

    ngOnInit() {
        this.foodUnits = foodUnits
        this.thingForm.get('category')!.setValue(this.data.category)
        this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges:', changes['data'].currentValue);
        this.data = changes['data'].currentValue
        this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
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

    open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

    newThing() {
        console.log("thingForm", this.thingForm)
        this.tourService.post('things', this.thingForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('newThing - success', response);
        })
        .catch((error) => {
            console.error('newThing - error', error);
        });
    }

    initializeModal(thingID?: number) {
        if (thingID) {
            this.selectedThingID = thingID
            console.log(thingID)
            this.thingForm.setValue({
                category: this.data.category,
                name: this.thingsMap[thingID]['name'],
                perPerson: this.thingsMap[thingID]['perPerson'], 
                unitID: this.thingsMap[thingID]['unitID'],
                weight: this.thingsMap[thingID]['weight'],
            })
        } else {
            this.selectedThingID = -1
            this.thingForm.setValue({
                category: '',
                name: '',
                perPerson: null, 
                unitID: null,
                weight: null,
            })
        }
    }

    editThing(thingID: number) {
        this.tourService.put('things/'+thingID, this.thingForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('deleteThing - success', response);
        })
        .catch((error) => {
            console.error('deleteThing - error', error);
        });
    }

    deleteThing(thingID: number) {
        this.tourService.delete('things/'+thingID)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('deleteThing - success', response);
        })
        .catch((error) => {
            console.error('deleteThing - error', error);
        });
    }
}
