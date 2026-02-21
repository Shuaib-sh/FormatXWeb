import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  dataFormatTools = [
    {
      title: 'HL7 Parser',
      description: 'Parse HL7 v2 messages into structured JSON format.',
      icon: '📄',
      link: '#'
    },
    {
      title: 'JSON Formatter',
      description: 'Pretty print, minify, and validate JSON data.',
      icon: '{ }',
      link: '#'
    }
  ];

  fileTools = [
    {
      title: 'PDF → Image',
      description: 'Convert PDF documents to image files.',
      icon: '🖼️',
      link: '#'
    },
    {
      title: 'Image → PDF',
      description: 'Convert images into PDF documents.',
      icon: '📸',
      link: '#'
    },
    {
      title: 'Text → PDF',
      description: 'Convert plain text into downloadable PDF files.',
      icon: '📝',
      link: '#'
    }
  ];

  cleaningTools = [
    {
      title: 'Remove Duplicates',
      description: 'Remove duplicate lines from your text.',
      icon: '📋',
      link: '#'
    },
    {
      title: 'Trim Spaces',
      description: 'Remove extra whitespace and trim lines.',
      icon: '✂️',
      link: '#'
    },
    {
      title: 'Normalize Lines',
      description: 'Standardize line endings across platforms.',
      icon: '📏',
      link: '#'
    },
    {
      title: 'Remove Special Chars',
      description: 'Strip special characters from text content.',
      icon: '🔤',
      link: '#'
    }
  ];
}