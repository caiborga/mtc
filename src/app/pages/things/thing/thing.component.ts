import { Component, inject, Input, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Thing } from '../things.component';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: 'app-thing',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './thing.component.html',
  styleUrl: './thing.component.css'
})
export class ThingComponent {
    @Input() category: string = ''
    @Input() things: Thing[] = []
    @Input() title: string = ''

    thingForm = new FormGroup({
        category: new FormControl(''),
        name: new FormControl(''),
        perPerson: new FormControl(0), 
        unit: new FormControl(''),
        weight: new FormControl(0),
    });

    constructor(
        private tourService: TourService
    ) {}

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

    private modalService = inject(NgbModal);
	closeResult = '';

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
