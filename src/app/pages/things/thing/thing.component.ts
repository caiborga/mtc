import { Component, inject, Input, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Thing } from '../things.component';
import { TourService } from '../../../services/tour.service';
import { UnitPickerComponent } from '../../../shared/unit-picker/unit-picker.component';
import { CategoryData } from '../things.component';

@Component({
  selector: 'app-thing',
  standalone: true,
  imports: [ReactiveFormsModule, UnitPickerComponent],
  templateUrl: './thing.component.html',
  styleUrl: './thing.component.css'
})

export class ThingComponent {
    
    @Input() data: CategoryData;

    thingForm = new FormGroup({
        category: new FormControl(''),
        name: new FormControl(''),
        perPerson: new FormControl(0), 
        unit: new FormControl(''),
        weight: new FormControl(0),
    });

    private modalService = inject(NgbModal);
	closeResult = '';

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
        this.thingForm.get('category')!.setValue(this.data.category)
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
            console.log('newThing - success', response);
        })
        .catch((error) => {
            console.error('newThing - error', error);
        });
    }

}
