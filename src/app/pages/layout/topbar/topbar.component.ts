import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnDestroy {

    isAuthenticated: boolean = false;
    private authSubscription: Subscription;
    groupKey: string | null = ''

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) 
    {
        this.authSubscription = this.authService.isAuthenticated$.subscribe(
            isAuthenticated => {
                this.isAuthenticated = isAuthenticated;
                if ( this.isAuthenticated ) {
                    this.groupKey = this.localStorageService.getItem('key')
                }
            }
        );
    }

    ngOnDestroy() {
        // Achte darauf, das Abonnement zu beenden, um Speicherlecks zu vermeiden
        this.authSubscription.unsubscribe();
    }

    logout() {
        this.authService.logout()
    }
}
