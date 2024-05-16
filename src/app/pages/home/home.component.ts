import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, Validators } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AuthService } from '../../core/services/auth-service.service';
import { NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, DatePickerComponent, FormsModule, NgbDropdownModule, ReactiveFormsModule, RouterLink, NgbTypeaheadModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

    groupIdFromLink: string = '';
    groupIdFromStorage: string | null = '';
    loadingData: boolean = false;
    newParticipants: Array<any> = [];
    newThings: Array<any> = [];
    participantsMap: Array<any> = [];
    tours: Array<any> = [];

    // @ViewChild('input') inputField: NgModel | null = null;
    @ViewChild('input') inputField!: NgModel;


    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private localStorageService: LocalStorageService,
        private tourService: TourService
    ) {}

    private modalService = inject(NgbModal);
    private sub: any;
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
        destination: new FormControl(''),
        name: new FormControl('', Validators.required),
        start: new FormControl('', Validators.required),
        end: new FormControl('', Validators.required),
    });

    async ngOnInit() {
        this.loadingData = true;
        let groupIsValid = false;
    
        // Get group ID from route params
        this.sub = this.route.params.subscribe(params => {
            this.groupIdFromLink = params['id'];
        });
    
        // Get group ID from storage
        this.groupIdFromStorage = this.localStorageService.getItem('key');
    
        // Validate group ID
        if (this.groupIdFromLink || this.groupIdFromStorage) {
            if (this.groupIdFromLink) {
                groupIsValid = await this.groupIsValid(this.groupIdFromLink);
                if (groupIsValid) {
                    // Set group ID in storage if valid
                    this.localStorageService.setItem('key', this.groupIdFromLink);
                    this.authService.login();
                }
            } else if (this.groupIdFromStorage) {
                groupIsValid = await this.groupIsValid(this.groupIdFromStorage);
                if (groupIsValid) {
                    this.authService.login();
                }
            }
        }
    
        // Redirect and logout if group is not valid
        if (!groupIsValid) {
            this.router.navigate(['/', 'register']);
            this.authService.logout();
            return;
        }
    
        // Proceed with other actions if group is valid
        this.getTours();
        this.getParticipants();
    }

    async groupIsValid(groupId: string): Promise<boolean> {
        try {
            const response = await this.tourService.get('group/' + groupId).toPromise();
            console.log('groupIsValid - success:', response);
            return response.existing;
        } catch (error) {
            console.log('groupIsValid - error:', error);
            return false;
        }
    }

    getTours(){
        this.loadingData = true;
        this.tourService.get('tours')
        .toPromise()
        .then((response) => {
            this.tours = response.tours;
            // console.log('getTours - success:', this.tours);
            for (let tour in this.tours) {
                let participants = JSON.parse(this.tours[tour].tour_participants)
                let tourData = JSON.parse(this.tours[tour].tour_data)
                this.tours[tour].participants = participants
                this.tours[tour].tourData = tourData
            }
            this.loadingData = false;
            console.log('getTours - success:', this.tours);
            
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('getTours - error:', error);
        });
    }

    getParticipants() {
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            //this.participantsMap = response.participants;
            // console.log('getParticipants - success', this.participantsMap);
            for (var i = 0; i < response.participants.length; i++) {
                var id = response.participants[i].id;
                this.participantsMap[id] = response.participants[i];
            }
            // console.log("participantsMap", this.participantsMap)

        })
        .catch((error) => {
            console.error('getParticipants - error', error);
        });
    }

    newTour() {
        const data = {
            tourCars: JSON.stringify([]),
            tourData: JSON.stringify(this.tourForm.value),
            tourThings: JSON.stringify([]),
            tourParticipants: JSON.stringify(this.newParticipants),
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

    addParticipant(participant: any){
        const index = this.newParticipants.indexOf(participant);
        if (index === -1) {
        console.log("index",index)
            let newParticipantObject: any = {};
            newParticipantObject = {
                id: participant.item.id,
                start: this.tourForm.get('start')!.value,
                end: this.tourForm.get('end')!.value,
            };
            this.newParticipants.push(newParticipantObject);
            console.log(this.newParticipants)
        }
    }

    removeParticipant(participantID: any) {
        const index = this.newParticipants.indexOf(participantID);
        if (index !== -1) {
            this.newParticipants.splice(index, 1);
        }
        console.log(this.newParticipants)

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
