import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-inner-html',
  template: '<div [innerHTML]="safeHTML"></div>'
})

export class InnerHTMLComponent implements OnChanges {

  @Input() html: string;
  public safeHTML: SafeHtml;

  constructor(private sanitized: DomSanitizer) { }

  ngOnChanges() {
    const html = this.html
      .replace(/(^\n+)|(\n+$)/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\n/g, '<br>');
    this.safeHTML = this.sanitized.bypassSecurityTrustHtml(html);
  }

}
