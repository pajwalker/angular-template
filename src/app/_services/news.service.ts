import { Injectable } from '@angular/core';
import type News from "../_models/News";
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable({
    providedIn: 'root',
})
export class NewsFetchService {
    async fetchNews(): Promise<News[]> {
        const data: string = await axios.get('https://www.phlu.ch/').then((response) => response.data);
        const $ = cheerio.load(data);

        const news: News[] = [];
        $('#aktuelles').find('ul > li').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const description = $(element).find('.lead-text').text().trim();
            const thumbnail = $(element).find('img').attr('data-srcset') || '';
            news.push({ title, description, thumbnail });
        });

        return Promise.resolve(news);
    }
}
