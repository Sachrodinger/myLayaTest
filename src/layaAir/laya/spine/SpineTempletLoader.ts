import { IResourceLoader, ILoadTask, Loader } from "../net/Loader";
import { Utils } from "../utils/Utils";
import { SpineTemplet } from "./SpineTemplet";


class SpineTempletLoader implements IResourceLoader {
    load(task: ILoadTask) {
        let atlasUrl = Utils.replaceFileExtension(task.url, "atlas");
        
        let promisesBundle: Array<Promise<any>> = [];
        promisesBundle.push(Loader.GetBundleData(task, task.url, false));
        promisesBundle.push(Loader.GetBundleData(task, atlasUrl));
        return Promise.all(promisesBundle).then(res => {
            let promises: Array<Promise<any>> = []; 
            if (res[0]){
                promises.push(Promise.resolve(res[0].buffer));
            }
            else{
                promises.push(task.loader.fetch(task.url, task.ext == "skel" ? "arraybuffer" : "json", task.progress.createCallback()));
            }
            if (res[1]){
                promises.push(Promise.resolve(res[1]));
            }
            else
            {
                promises.push(task.loader.fetch(atlasUrl, "text", task.progress.createCallback()));
            }
            return Promise.all(promises).then(res2 => {
                if (!res2[0] || !res2[1])
                    return null;

                let templet = new SpineTemplet();
                return templet._parse(res2[0], res2[1], task.url, task.progress).then(() => templet);
            });
        });
    }
}

Loader.registerLoader(["skel"], SpineTempletLoader, Loader.SPINE);