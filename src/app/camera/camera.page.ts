import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CameraImageData, CameraMultiCapture, CameraOverlayOptions, CameraOverlayResult, initialize } from 'camera-multi-capture';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CameraPage implements OnInit {
  capturedImages: string[] = [];
  capturedPhoto: string = '';
  statusMessages: string[] = [];
  cameraOverlayOptions: CameraOverlayOptions = {
    quality: 90,
    containerId: 'camera-container'
  }
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    // Apply transparent class to app root for maximum transparency
    document.querySelector('ion-app')?.classList.add('camera-mode');
    // Start the camera when the page loads
  }

  async ionViewDidEnter() {
    const cameraInitOptions = {
      quality: 90,
      containerId: 'camera-container'
    }

    const result: CameraOverlayResult = await initialize(cameraInitOptions);
    this.capturedImages = result.images.map((image: CameraImageData) => image.uri);

    // go back
    this.close();
  }

  // Add a status message
  addStatus(message: string) {
    this.statusMessages.push(message);
    // Keep only the last 5 messages
    if (this.statusMessages.length > 5) {
      this.statusMessages.shift();
    }
  }

  async close() {
    try {
      this.addStatus('Stopping camera...');
      await CameraMultiCapture.stop();
      this.addStatus('Camera stopped');
    } catch (error: any) {
      this.addStatus(`Error stopping camera: ${error?.message || String(error)}`);
    } finally {
      // Go back to the home page with the captured images
      if (!this.capturedImages.length || this.capturedImages.length < 1) {
        this.addStatus('No images captured');
        return;
      } else {
        this.addStatus(`Length of captured images: ${this.capturedImages.length}`);

        this.navCtrl.navigateBack('/home', {
          state: {
            capturedImages: this.capturedImages,
            capturedPhoto: this.capturedPhoto
          }
        });
      }

    }
  }
}
