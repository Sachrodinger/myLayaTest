import { ILoadTask, IResourceLoader, Loader } from "../../net/Loader";
import { URL } from "../../net/URL";
import { IShaderpassStructor, Shader3D } from "../../RenderEngine/RenderShader/Shader3D";
import { SubShader } from "../../RenderEngine/RenderShader/SubShader";
import { AssetDb } from "../../resource/AssetDb";
import { ShaderCompile } from "../../webgl/utils/ShaderCompile";
import { ShaderParser } from "./ShaderParser";

class ShaderLoader implements IResourceLoader {
    load(task: ILoadTask) {
        let url = task.url;
        if (task.ext === "bps")
            url = AssetDb.inst.getSubAssetURL(url, task.uuid, "0", "shader");
            return Loader.GetBundleData(task, task.url).then(bundleData=>{
                let p:Promise<any>;
                if (bundleData){
                    p = Promise.resolve(bundleData);
                }
                else
                {
                    p = task.loader.fetch(url, "text", task.progress.createCallback(), task.options);
                }
                return p.then(data => {
                    if (!data)
                        return null;
    
                    let obj = ShaderParser.getShaderBlock(data);
                    let cgmap = ShaderParser.getCGBlock(data);
                    ShaderParser.bindCG(obj, cgmap);
    
                    if (!obj.name || !obj.uniformMap)
                        return null;
    
                    let basePath = URL.getPath(task.url);
                    let passArray: IShaderpassStructor[] = obj.shaderPass;
                    return Promise.all(passArray.map(pass => ShaderCompile.compileAsync(pass.VS, pass.FS, basePath))).then(compiledObjs => {
                        if (compiledObjs.findIndex(obj => obj == null) != -1) {
                            Loader.warn("some pass null " + task.url);
                            return null;
                        }
    
                        let shader = Shader3D.add(obj.name, obj.enableInstancing, obj.supportReflectionProbe);
                        let subshader = new SubShader(obj.attributeMap ? obj.attributeMap : SubShader.DefaultAttributeMap, obj.uniformMap, obj.defaultValue);
                        shader.addSubShader(subshader);
    
                        for (let i in passArray) {
                            subshader._addShaderPass(compiledObjs[i], passArray[i].pipeline);
                        }
                        return shader;
                    }); 
                });   
            });   
    }
}

Loader.registerLoader(["shader", "bps"], ShaderLoader);