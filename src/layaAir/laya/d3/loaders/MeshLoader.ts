import { IResourceLoader, ILoadTask, Loader } from "../../net/Loader";
import { AssetDb } from "../../resource/AssetDb";
import { MeshReader } from "./MeshReader";

class MeshLoader implements IResourceLoader {
    load(task: ILoadTask) {
        let url = AssetDb.inst.getSubAssetURL(task.url, task.uuid, null, "lm");
        return Loader.GetBundleData(task, url, false).then(bundleData => {
            let p:Promise<any>;
            if(bundleData){
                p = Promise.resolve(bundleData.buffer);                
            }
            else{
                p = task.loader.fetch(url, "arraybuffer", task.progress.createCallback(), task.options);
            }
            return p.then(data => {
                if (!data)
                    return null;
    
                return MeshReader._parse(data);
            });
        });
    }
}

Loader.registerLoader(["lm"], MeshLoader, Loader.MESH);