// import { Handler } from "../utils/Handler";
// import { ILaya } from "./../../ILaya";
// import { URL } from "./URL";
/**
 * Bundle管理类
 * @private
 */
//  export class BundleInfoManager {

//     static _fileLoadDic: Record<string, { type: string[], indexs: number[], bundleName:string }> = {};

//     static enable(infoFile: string, callback: Handler | null = null): void {
//         ILaya.loader.fetch(infoFile, "json").then(data => {
//             if (!data)
//                 return;

//                 BundleInfoManager.addAtlases(data);
//             callback && callback.run();
//         });
//     }

//     static addAtlases(data: Record<string, {url:string, indexs: number[], type: string[]}[]>) {
//         let dic = BundleInfoManager._fileLoadDic;
//         for (let key in data) {
//             let arr = data[key];
//             for (let i = 0; i < arr.length; i++) {
//                 let info = arr[i]
//                 let formatURL = URL.formatURL(info.url);
//                 let entry = {
//                     bundleName: key,
//                     indexs: info.indexs,
//                     type: info.type
//                 }
//                 dic[formatURL] = entry
//             }
//         }
//     }

//     static getFileLoadPath(file: string): { type: string[], indexs: number[], bundleName:string } {
//         return BundleInfoManager._fileLoadDic[file];
//     }
// }
