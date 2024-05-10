import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { AuthService } from '../../core/services/auth-service.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { backendUrl } from '../../../../environment';

interface Response {
    message: string,
    key: string
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    name: string = ''
    link: string = ''

    constructor(
        private authService: AuthService,
        private clipboard: Clipboard,
        private router: Router,
        private tourService: TourService,
        private localStorage: LocalStorageService
    ) {}

    copyToClipboard() {
        this.clipboard.copy(this.link);
    }

    registerGroup() {
        let data = { 
            name: this.name
        }
        this.tourService.post('register', data)
        .toPromise()
        .then((response: any) => {
            console.log('registerGroup - success', response.message);
            this.authService.login()
            this.localStorage.setItem('key', response.key)
            this.link = `${backendUrl}/${response.key}/`
        })
        .catch((error) => {
            console.error('registerGroup - error', error);
        });
    }
}
