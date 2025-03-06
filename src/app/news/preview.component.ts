import { Component, Input } from '@angular/core';

// preview.component.ts

@Component({
    selector: 'app-news-preview',
    templateUrl: './preview.component.html'
})
export class PreviewComponent {
    @Input() title!: string;
    @Input() description!: string;
    @Input() img!: string;
}
