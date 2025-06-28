import { Component, OnInit } from '@angular/core';
import { AboutUs, AboutUsService } from '../../Service/about-us.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-about-component',
  imports: [NgFor,NgIf],
  templateUrl: './about-component.component.html',
  styleUrl: './about-component.component.css'
})
export class AboutComponentComponent  implements OnInit {
  aboutUsList: AboutUs[] = [];
  loading = true;
  error = '';

  constructor(private aboutUsService: AboutUsService) { }

  ngOnInit(): void {
    this.loadAboutUsData();
  }

  loadAboutUsData(): void {
    this.loading = true;
    this.aboutUsService.getAll().subscribe({
      next: (data) => {
        this.aboutUsList = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load About Us data';
        this.loading = false;
        console.error('Error loading About Us:', err);
      }
    });
  }

  isVideo(filePath: string): boolean {
    if (!filePath) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  openVideo(videoUrl: string): void {
    window.open(videoUrl, '_blank');
  }
}