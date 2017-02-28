import {Record} from 'immutable';

const PicRecord = Record({
	description: "",
	thumbnailUrl: "",
	previewUrl: "",
	fullUrl: "",
	author: {},
	source: 0,
	licenseId: 0,
	primaryColor: "",
	foundAt: ""
});

export class Pic extends PicRecord{
	description: string;
	previewUrl: string;
	fullUrl: string;
	author: any;
	source: number;
	licenseId: number;
	primaryColor: string;
	foundAt: string;

	constructor(pic){
		super(pic);
	}

	
}