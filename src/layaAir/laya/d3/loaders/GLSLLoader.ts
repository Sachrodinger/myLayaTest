import { ILoadTask, IResourceLoader, Loader } from "../../net/Loader";
import { ShaderCompile } from "../../webgl/utils/ShaderCompile";

class GLSLLoader implements IResourceLoader {
    load(task: ILoadTask) {
        let url = task.url;
        return Loader.GetBundleData(task, url).then(bundleData=>{
            let p:Promise<any>;
            if (bundleData){
                p = Promise.resolve(bundleData);
            }
            else{
                p = task.loader.fetch(url, "text", task.progress.createCallback(), task.options);
            }
            return p.then(data => {
                if (!data)
                    return null;

                return ShaderCompile.addInclude(task.url, data, true);
            });
        });
    }
}

Loader.registerLoader(["glsl", "vs", "fs"], GLSLLoader);