import {Injectable, Inject} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Pic} from "./pic-store/pic";
import {List} from "immutable";
import {BehaviorSubject} from "rxjs/Rx";

export class LocalStore{
    public static KEY_COLLECTION='collections';
    public static KEY_SIDEBAR='sidebar';
    public static KEY_FAVOURITE='favourite';
    public static KEY_DOWNLOAD_PATH='download_path';
	private _collections: BehaviorSubject<any> = new BehaviorSubject([]);
    private _sidebar: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _downloadPath: BehaviorSubject<string> = new BehaviorSubject('');
    public collection$ = this._collections.asObservable();
    public selectedCollection: any;
    constructor() {
        this.initCollections();
        this.initSidebarVisibility();
        this.initDownloadPath();
        
    }

    get showSidebar(){
        return this._sidebar.asObservable();
    }
    get downloadPath(){
        return this._downloadPath.asObservable();
    }
    initSidebarVisibility(){
        if(this.get(LocalStore.KEY_SIDEBAR)==null){
            this.store(LocalStore.KEY_SIDEBAR,true);
        }else{
            this._sidebar.next(this.get(LocalStore.KEY_SIDEBAR)==='true');
        }
    }
    initDownloadPath(){
        if(this.get(LocalStore.KEY_DOWNLOAD_PATH)==null){
            this.store(LocalStore.KEY_DOWNLOAD_PATH,'unset');
        }
        this._downloadPath.next(this.get(LocalStore.KEY_DOWNLOAD_PATH));
    }
    setDownloadPath(path){
        this.store(LocalStore.KEY_DOWNLOAD_PATH,path);
        this._downloadPath.next(path);
    }
    updateSidebarVisibility(visible){
        this.store(LocalStore.KEY_SIDEBAR,visible);
        this.initSidebarVisibility();
    }
    get collections() {
        return this._collections.asObservable();
    }
    initCollections(){
		if(!this.get(LocalStore.KEY_COLLECTION)){
			this.storeCollections({collections:['Favourite'],favourite:[]});
		}
		var collections = this.getJson(LocalStore.KEY_COLLECTION);
        this._collections.next(collections);
    }
    isInCollection(pic, collection){
        collection = collection.toLowerCase();
        let item = this._collections.getValue()[collection].find(item => item.foundAt == pic.foundAt);
        return (item !== undefined);
    }
    removeFromCollection(pic, collection){
        collection = collection.toLowerCase();
        let pics = this._collections.getValue()[collection];
        let item = pics.find(item => item.fullUrl === pic.fullUrl);
        pics.splice(pics.indexOf(item), 1);
        this._collections.getValue()[collection]= pics;
        this.updateCollections(this._collections.getValue());
        this.storeCollections(this._collections.getValue());
    }
    addCollection(collection:string){
        var key = collection.toLowerCase();
		var collections = this._collections.getValue();
		if(collections[key]){
			console.log('collection already exist');
		}else{
            collections.collections.push(collection);
			collections[key]=[];
		}
        this.storeCollections(collections);
        this.updateCollections(collections);
    }
    removeCollection(collection:string){
        var key = collection.toLowerCase();
        var collections = this._collections.getValue();
        collections.collections.splice(collections.collections.indexOf(collection),1);
        delete collections[key];
        this.storeCollections(collections);
        this.updateCollections(collections);
    }
    addPicToCollection(pic, collection){
        collection = collection.toLowerCase();
        var collections = this._collections.getValue();
        collections[collection].push(pic);
        this.storeCollections(collections);
        this.updateCollections(collections);
    }
    updateCollections(collections){
        this._collections.next(collections);
    }
    storeCollections(collections){
        this.store(LocalStore.KEY_COLLECTION,JSON.stringify(collections));
    }
    store(key,value){
        localStorage.setItem(key,value);
    }
    get(key){
        return localStorage.getItem(key);
    }
    getJson(key){
        return JSON.parse(this.get(key));
    }
    
}