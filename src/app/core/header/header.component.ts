import { Component, OnInit, OnDestroy, inject, Inject, Injectable, afterNextRender } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WINDOW } from '../../_services/window.service';
import { DOCUMENT } from '@angular/common';



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
export class HeaderComponent implements OnInit, OnDestroy  {
    private _window = inject(WINDOW);
    private document = this._window.document;

    constructor(private router: Router) {
        afterNextRender(() => {
            this.state.interval = this._window.setInterval(() => {
                if (this.state.didScroll) {
                    this.hasScrolled();
                    this.state.didScroll = false;
                    this.state.changedRoute = false;
                } 
            }, 250);
        });
    }

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

    changeState(): void {
        this.state.isMenuOpen = !this.state.isMenuOpen;
    }    

    goTo(route: string): void {
        if (this.state.isMenuOpen) this.changeState();
        this.router.navigate([route])
    }


    ngOnInit(): void {
        this.scrollEvent = this.onScroll.bind(this);
        this._window.addEventListener('scroll', this.scrollEvent);

        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.state.changedRoute = true;
                this.hasScrolled();
            }
        });
    }

    ngOnDestroy(): void {
        this._window.removeEventListener('scroll', this.scrollEvent);
        clearInterval(this.state.interval);
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    private onScroll(): void {
        this.state.didScroll = true;
    }

    private hasScrolled(): void {
        const st = this._window.scrollY;
        const header = this.document.querySelector('header');

        if (Math.abs(this.state.lastScrollTop - st) <= this.state.delta) return;

        if (header) {
            if (st > this.state.lastScrollTop && st > this.state.navbarHeight && !this.state.changedRoute) {
                header.setAttribute('style', 'transition: top 0.5s ease-out 0s; top: -' + this.state.navbarHeight + 'px;');
            } else {
                if (st + this._window.innerHeight < this.document.body.clientHeight || this.state.changedRoute) {
                    header.setAttribute('style', 'transition: top 1s cubic-bezier(0, 0.97, 0.58, 1) 0s; top: 0px;');
                }
            }
        }

        this.state.lastScrollTop = 0;
    }
}
