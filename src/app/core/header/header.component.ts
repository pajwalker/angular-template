import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface HeaderLink {
    id: number;
    title: string;
    link: string;
    sublinks?: Array<HeaderLink>;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [RouterLink, CommonModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
    links: Array<HeaderLink> = [
        { id: 1, title: 'Home', link: '/' },
        { id: 2, title: 'Studium', link: '/studium' },
        {
            id: 3, title: 'Weiterbildung', link: '/Weiterbildung', sublinks: [
                { id: 1, title: 'CAS', link: '/Weiterbildung/CAS' },
                { id: 2, title: 'DAS', link: '/Weiterbildung/DAS' },
                { id: 3, title: 'MAS', link: '/Weiterbildung/MAS' }
            ]
        },
        { id: 4, title: 'Forschung', link: '/Forschung' },
        { id: 5, title: 'Über uns', link: '/Über-uns' }
    ];

    state = {
        isMenuOpen: false,
        lastScrollTop: 0,
        delta: 5,
        navbarHeight: 72,
        interval: 0,
        didScroll: false,
        changedRoute: false
    };

    private scrollEvent: any;
    private routeSubscription: Subscription | undefined;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.scrollEvent = this.onScroll.bind(this);
        window.addEventListener('scroll', this.scrollEvent);

        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.state.changedRoute = true;
                this.hasScrolled();
            }
        });

        this.state.interval = window.setInterval(() => {
            if (this.state.didScroll) {
                this.hasScrolled();
                this.state.didScroll = false;
                this.state.changedRoute = false;
            }
        }, 250);
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.scrollEvent);
        clearInterval(this.state.interval);
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    changeState(): void {
        this.state.isMenuOpen = !this.state.isMenuOpen;
    }

    goTo(route: string): void {
        if (this.state.isMenuOpen) this.changeState();
        this.router.navigate([route]);
    }

    private onScroll(): void {
        this.state.didScroll = true;
    }

    private hasScrolled(): void {
        const st = window.scrollY;
        const header = document.querySelector('header');

        if (Math.abs(this.state.lastScrollTop - st) <= this.state.delta) return;

        if (header) {
            if (st > this.state.lastScrollTop && st > this.state.navbarHeight && !this.state.changedRoute) {
                header.setAttribute('style', 'transition: top 0.5s ease-out 0s; top: -' + this.state.navbarHeight + 'px;');
            } else {
                if (st + window.innerHeight < document.body.clientHeight || this.state.changedRoute) {
                    header.setAttribute('style', 'transition: top 1s cubic-bezier(0, 0.97, 0.58, 1) 0s; top: 0px;');
                }
            }
        }

        this.state.lastScrollTop = st;
    }
}
