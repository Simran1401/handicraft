import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OJ-Ease';
  
  constructor(private renderer: Renderer2, private router: Router,) { }

  ngOnInit() {

    const javaScriptForPages = this.renderer.createElement('script');
    javaScriptForPages.src = `../../assets/js/plugins.js`;
    this.renderer.appendChild(document.head, javaScriptForPages);
    const javaScript2ForPages = this.renderer.createElement('script');
    javaScript2ForPages.src = `../../assets/js/theme.js`;
    this.renderer.appendChild(document.head, javaScript2ForPages);
  }
}
