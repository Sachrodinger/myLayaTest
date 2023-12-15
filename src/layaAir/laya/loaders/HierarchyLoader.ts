import { IResourceLoader, ILoadTask, Loader } from "../net/Loader";
import { URL } from "../net/URL";
import { AssetDb } from "../resource/AssetDb";
import { Prefab } from "../resource/HierarchyResource";
import { IHierarchyParserAPI, PrefabImpl } from "../resource/PrefabImpl";
import { HierarchyParser } from "./HierarchyParser";
import { LegacyUIParser } from "./LegacyUIParser";

export class HierarchyLoader implements IResourceLoader {
    static v3: IHierarchyParserAPI = HierarchyParser;
    static v2: IHierarchyParserAPI = null;
    static legacySceneOrPrefab: IHierarchyParserAPI = LegacyUIParser;

    load(task: ILoadTask) {
        let url = task.url;
        let isModel = task.ext == "gltf" || task.ext == "fbx" || task.ext == "glb";
        if (isModel)
            url = AssetDb.inst.getSubAssetURL(url, task.uuid, "0", "lh");

        return Loader.GetBundleData(task, task.url).then(bundleData=>{
            let p:Promise<any>;
            if (bundleData){
                p = Promise.resolve(JSON.parse(bundleData));
            }
            else {
                p = task.loader.fetch(url, "json", task.progress.createCallback(0.2), task.options); 
            }
            return p.then(data => {
                if (!data)
                    return null;
    
                if (data._$ver != null)
                    return this._load(HierarchyLoader.v3, task, data, 3);
                else if (task.ext == "ls" || task.ext == "lh")
                    return this._load(HierarchyLoader.v2, task, data, 2);
                else if (task.ext == "scene" || task.ext == "prefab")
                    return this._load(HierarchyLoader.legacySceneOrPrefab, task, data, 2);
                else
                    return null;
            });
        });        
    }

    //@internal
    private _load(api: IHierarchyParserAPI, task: ILoadTask, data: any, version: number): Promise<Prefab> {
        let basePath = URL.getPath(task.url);
        let links = api.collectResourceLinks(data, basePath);
        return task.loader.load(links, null, task.progress.createCallback()).then((resArray: any[]) => {
            let res = new PrefabImpl(api, data, version);
            res.addDeps(resArray);
            return res;
        });
    }
}

Loader.registerLoader(["lh", "ls", "scene", "prefab"], HierarchyLoader, Loader.HIERARCHY);