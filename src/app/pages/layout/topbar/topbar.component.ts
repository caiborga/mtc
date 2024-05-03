import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { TourService } from '../../../core/services/tour.service';
import { Group } from '../../../core/models/group';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [NgbTooltipModule, RouterLink],
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnDestroy {

    isAuthenticated: boolean = false;
    private authSubscription: Subscription;
    group: Group = {
        key: '',
        name: ''
    }

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private tourService: TourService
    ) 
    {
        this.authSubscription = this.authService.isAuthenticated$.subscribe(
            isAuthenticated => {
                this.isAuthenticated = isAuthenticated;
                if ( this.isAuthenticated ) {
                    this.group.key = this.localStorageService.getItem('key')
                    this.getGroupName()
                }
            }
        );
    }

    ngOnInit() {
        this.group.key = this.localStorageService.getItem('key')
        if ( this.group.key ) {
            this.isAuthenticated = true
            this.getGroupName()
        }
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

    getGroupName() {
        this.tourService.get('group/' + this.group.key)
        .toPromise()
        .then((response) => {
            this.group.name = response.name
            console.log('getGroupName - success:', response);
        })
        .catch((error) => {
            console.error('getGroupName - error:', error);
        });
    }

    logout() {
        this.authService.logout()
    }
}
