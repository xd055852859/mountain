import { Comment } from "./Common";
import { User } from "./User";

export interface Resource {
  allowOffer: boolean;
  area: string;
  // boarder: null,
  contacts: string;
  contactsName: string;
  contactsTel: string;
  depositTime: string;
  describe: string;
  imageList: string[];
  // location: null,
  name: string;
  offer: string;
  offerBegTime: number;
  offerEndTime: number;
  regionArr: { areaCode: string; level: number; name: string; _key: string }[];
  regionCode: string;
  rentOfYear: number;
  sMethod: string;
  star: null | number;
  tagInfo: { _key: string; name: string; unit: string };
  unused:boolean,
  _key: string;
}
export interface ResourceInfo extends Resource {
  contactsInfo: User;
  tagKey: string;
  uploadTime: number;
  uploadUser: string;
  _key: string;
  offerNum?: number;
}
export interface Environment {
  address: null | string;
  contacts: string;
  contactsInfo: User;
  describe: string;
  detailInfo: { _key: string; name: string };
  location: number[];
  tagInfo: { _key: string; name: string };
  title: string;
  uploadTime: number;
  imageList: null | string[];
  regionCode: number;
  _key: string;
}
export interface EnvironmentInfo extends Environment {
  contactsInfo: User;
  replyList: Comment[];
  uploadTime: number;
  uploadUser: string;
  _key: string;
  location: number[];
}
