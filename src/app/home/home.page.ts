import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  capturedImages: string[] = [];

  capturedPhoto: string = '';
  isCapturing = false;
  statusMessages: string[] = [];
  permissionStatus: string = 'unknown';
  captureError: string = '';
  
  // Add the missing methods referenced in the HTML
  // These methods have been moved to the camera page

  constructor(private router: Router, private navCtrl: NavController) {
    // Listen for navigation parameters when returning from camera page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkForCameraData();
      }
    });
  }

  // Helper method to add status messages
  addStatus(message: string) {
    console.log(message);
    this.statusMessages.push(message);
  }

  // Check for data passed back from the camera page
  private checkForCameraData() {
    this.addStatus('Checking for camera data...');
    if (this.router.getCurrentNavigation()?.extras.state) {
      const state = this.router.getCurrentNavigation()?.extras.state as any;
      if (state && state['capturedImages']) {
        this.capturedImages = state['capturedImages'];
      }
      if (state && state['capturedPhoto']) {
        this.capturedPhoto = state['capturedPhoto'];
      }
    }
    this.addStatus('Camera data checked');
  }

  async openCamera() {
    // Reset status messages
    this.statusMessages = [];
    this.captureError = '';
    
    try {
      // First check camera permissions
      this.addStatus('Checking camera permissions...');
      const permissionStatus = await Camera.checkPermissions();
      
      if (permissionStatus.camera !== 'granted') {
        this.addStatus('Requesting camera permission...');
        const requestResult = await Camera.requestPermissions({ permissions: ['camera'] });
        
        if (requestResult.camera !== 'granted') {
          this.addStatus('Permission denied, cannot proceed');
          this.captureError = 'Camera permission required';
          return;
        }
      }
      
      // Navigate to the dedicated camera page
      this.addStatus('Opening camera page...');
      this.navCtrl.navigateForward('/camera');
  
      
    } catch (error: any) {
      console.error('Error preparing camera:', error);
      this.addStatus(`Error: ${error?.message || String(error)}`);
      this.captureError = `Error: ${error?.message || String(error)}`;
    }
  }

  clearImages() {
    this.capturedImages = [];
  }
}
