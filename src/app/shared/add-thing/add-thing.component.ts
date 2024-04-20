import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { CategoryData } from '../../pages/things/things.component';
import { TourService } from '../../core/services/tour.service';
import { UnitPickerComponent } from '../unit-picker/unit-picker.component';

@Component({
    selector: 'app-add-thing',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, UnitPickerComponent],
    templateUrl: './add-thing.component.html',
    styleUrl: './add-thing.component.css'
})
export class AddThingComponent {

    @Input() data: CategoryData;
    @Output() reloadData = new EventEmitter();

    selectedThingID: number = -1;

    thingForm = new FormGroup({
        category: new FormControl(''),
        id: new FormControl(-1),
        name: new FormControl(''),
        perPerson: new FormControl(null), 
        unitID: new FormControl(0),
        weight: new FormControl(null),
    });

    thingsMap: any;

    private modalService = inject(NgbModal);

    constructor(
        private tourService: TourService
    ) {
        this.data = {
            category: '',
            relevantColumns: {
                category: true,
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
        this.thingForm.get('category')!.setValue(this.data.category)
        this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
    }

    editThing() {
        this.tourService.put('things/'+ this.thingForm.value.id, this.thingForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('editThing - success', response);
        })
        .catch((error) => {
            console.error('editThing - error', error);
        });
    }

    initializeModal(thingID?: number) {
        if (thingID) {
            this.selectedThingID = thingID
            console.log(thingID)
            this.thingForm.setValue({
                category: this.data.category,
                id: thingID,
                name: this.thingsMap[thingID]['name'],
                perPerson: this.thingsMap[thingID]['perPerson'], 
                unitID: this.thingsMap[thingID]['unitID'],
                weight: this.thingsMap[thingID]['weight'],
            })
        } else {
            this.selectedThingID = -1
            this.thingForm.setValue({
                category: this.data.category,
                id: -1,
                name: '',
                perPerson: null, 
                unitID: null,
                weight: null,
            })
        }
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


    open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
	}

}
