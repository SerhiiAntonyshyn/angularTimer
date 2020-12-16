import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { StopwatchService } from '../services/stopwatch.service';
import { displayedTime} from './../interfaces/displayed-time'
  
export class Constants {
  static PERIOD = 10;
  static INCREMENT = Constants.PERIOD / 1000;
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  public startButton: string = 'Start';
  public isStarted: boolean = false;
  public isWait: boolean = false;
  private lastClick!: number;
  private subscription!: Subscription;
  public timeForDisplay: displayedTime = {
    h: '00',
    m: '00',
    s: '00'
  };
  

  private timer$!: Observable<displayedTime>;
  
  constructor(private stopwatchServise: StopwatchService) { }
  
  runStopwatch(): void{
    if (!this.isStarted){
      if (!this.isWait){
        this.timer$ = this.stopwatchServise.startTimer();
      }
      else if (this.isWait){
        let currentTime = (+this.timeForDisplay.h*3600 + +this.timeForDisplay.m*60 + +this.timeForDisplay.s)*1000;
        this.timer$ = this.stopwatchServise.startTimer(currentTime);
      }
      this.subscription = this.stopwatchServise.timerStream$.subscribe( time => {
           this.timeForDisplay = time;
      });
      this.startButton = 'Stop';
    }
    else{
      this.stopwatchServise.subscription.unsubscribe();
      this.subscription.unsubscribe();
      this.timeForDisplay.s = "00";
      this.timeForDisplay.s = "00";
      this.timeForDisplay.s = "00";
      this.startButton = 'Start';
      
    }
    this.isStarted = !this.isStarted;
  }

  pauseStopwatch(event: any): void {
    if(this.lastClick){
      let diff = event.timeStamp - this.lastClick;
      if (diff <= 300){
        this.subscription.unsubscribe();
        this.stopwatchServise.subscription.unsubscribe();
        this.isStarted = false;
        this.isWait = true;
        this.startButton = 'Start';
      }
    }
    this.lastClick = event.timeStamp;
  }

  resetStopwatch():void {
    this.stopwatchServise.resetTimer();
  }

  ngOnInit(): void {
  }

  ngOnDestroy():void {
    this.stopwatchServise.subscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
