// footer.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface HeaderLink {
    id: number;
    title: string;
    link: string;
}

@Component({
    imports: [RouterLink, CommonModule],
    selector: 'app-footer',
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    address: string = "PH Luzern\nPfistergasse 20\n6003 Luzern";

    links: HeaderLink[] = [
        { id: 1, title: 'Home', link: '/' },
        { id: 2, title: 'Studium', link: '/studium' },
        { id: 3, title: 'Weiterbildung', link: '/Weiterbildung' },
        { id: 4, title: 'Forschung', link: '/Forschung' },
        { id: 5, title: 'Über uns', link: '/Über-uns' }
    ];
}
