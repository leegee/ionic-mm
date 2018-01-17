import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TextRenderer } from './text-renderer';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';

describe('text-renderer', () => {
  it('should load', () => expect(TextRenderer).toBeDefined());

//   it('should have expected <h3> text', () => {
//     fixture.detectChanges();
//     const h3 = de.nativeElement;
//     expect(h3.innerText).toMatch(/ionic/i,
//       '<h3> should say something about "Ionic"');
//   });

//   it('should show the favicon as <img>', () => {
//     fixture.detectChanges();
//     const img: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
//     expect(img.src).toContain('assets/icon/favicon.ico');
//   });
});