import { Injectable, Inject } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import * as electron from 'electron';
import { LocalStore } from './local-store';

declare let Notification:any;
@Injectable()
export class ElectronService {
  private _downloading: BehaviorSubject<string> = new BehaviorSubject('');
  private _progress: BehaviorSubject<number> = new BehaviorSubject(-1);
  private savePath;
  constructor(private store: LocalStore) {
    this.store.downloadPath.subscribe(path=>{
      if(path==='unset'){
        store.setDownloadPath(electron.remote.app.getPath('documents'));
        this.savePath = electron.remote.app.getPath('documents');
      }else{
        this.savePath = path;
      }
    })
    this.initDownload();
    
  }
  get isDownloading() {
      return this._downloading.asObservable();
  }
  get progress(){
    return this._progress.asObservable();
  }
  initDownload(){
    electron.ipcRenderer.on('get-download-path', (event, message) => {
      electron.ipcRenderer.send('set-download-path', this.savePath);
    });
    electron.ipcRenderer.on('download-progress',(event,progress)=>{
      this._downloading.next('is-loading');
      this._progress.next(progress);
    });
    electron.ipcRenderer.on('download-complete', (event,path)=>{
      let notification = new Notification('Download Complete',{body:'Download Complete <br /> File saved at: ' + path});
      this._downloading.next('');
      this._progress.next(-1);
    })
  }
  changeDownloadPath(){
    electron.ipcRenderer.send('change-download-path');
    electron.ipcRenderer.on('set-download-path',(event,path)=>{
      this.store.setDownloadPath(path);
    })
  }
  getRemoteApp(){
    return electron.remote.app;
  }
  get downloadPath(){
    return this.store.downloadPath;
  }
  openExternal(link){
    electron.shell.openExternal(link);
  }
}
