// home.component.ts
import { Component, OnInit } from '@angular/core';
import { NewsFetchService } from '../_services/news.service';
import News from '../_models/News';
import { PreviewComponent } from '../news/preview.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [NewsFetchService],
    imports: [PreviewComponent, CommonModule],
})
export class HomeComponent implements OnInit {
    news: News[] = [];

    constructor(private newsFetchService: NewsFetchService) {}

    async ngOnInit() {
        this.news = await this.newsFetchService.fetchNews() || [];
    }
}
