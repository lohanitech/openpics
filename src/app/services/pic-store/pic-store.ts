import {Injectable, Inject} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Pic} from "./pic";
import {List} from "immutable";
import {BehaviorSubject} from "rxjs/Rx";

export class PicStore{
	private _pics: BehaviorSubject<List<Pic>> = new BehaviorSubject(List([]));
    public pics$ = this._pics.asObservable();
    public selectedPic: Pic;
    constructor() {
        
    }

    get pics() {
        return this._pics.asObservable();
    }
    initPics(){
        this._pics.next(List([]));
    }
    addPics(pics){
        this._pics.next(this._pics.getValue().concat(pics).toList());
    }
    initCollectionPics(pics){
        this._pics.next(pics);
    }
}