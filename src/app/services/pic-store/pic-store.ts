import {Injectable, Inject} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Pic} from "./pic";
import {List} from "immutable";
import {BehaviorSubject} from "rxjs/Rx";

export class PicStore{
	private _pics: BehaviorSubject<any> = new BehaviorSubject([]);
    public pics$ = this._pics.asObservable();
    public selectedPic: Pic;
    public cols = 4;
    constructor() {
        
    }

    get pics() {
        return this._pics.asObservable();
    }
    initPics(){
        var iEmpty = [];
        for(var i=0; i<this.cols; i++){
            iEmpty.push([]);
        }
        this._pics.next(iEmpty);
    }
    addPics(pics){
        pics = this.divide(pics,this.cols);
        let existing = this._pics.getValue();
        for(var i=0; i<this.cols; i++){
            existing[i] = existing[i].concat(pics[i]);
        }
        this._pics.next(existing);
    }
    initCollectionPics(pics){
        pics = this.divide(pics,this.cols);
        this._pics.next(pics);
    }
    divide(pics, cols){
        var size = Math.ceil(pics.length/cols);
        var divided = [];
        for(var i=0; i<cols; i++){
            divided.push(pics.splice(0,size));
        }
        return divided;
    }
}