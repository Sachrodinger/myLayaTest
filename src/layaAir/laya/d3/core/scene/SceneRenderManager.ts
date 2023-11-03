import { LayaGL } from "../../../layagl/LayaGL";
import { ISceneRenderManager } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/ISceneRenderManager";
import { SingletonList } from "../../../utils/SingletonList";
import { BaseRender } from "../render/BaseRender";

/**
 * <code>类用来实现场景渲染节点管理<code/>
 */
export class SceneRenderManager {
    /**@internal */
    protected _sceneManagerOBJ: ISceneRenderManager;
    
    /**
     * 实例化一个场景管理节点
     */
    constructor() {
        this._sceneManagerOBJ = LayaGL.renderOBJCreate.createSceneRenderManager();
    }

    /**
     * get RenderList
     */
    get list(): SingletonList<BaseRender> {
        return this._sceneManagerOBJ.list;
    }

    set list(value: SingletonList<BaseRender>) {
        this._sceneManagerOBJ.list = value;
    }

    get map():Map<number, SingletonList<BaseRender>>{
        return this._sceneManagerOBJ.map;
    }

    set map(value :Map<number, SingletonList<BaseRender>>){
        this._sceneManagerOBJ.map = value;
    }

    /**
     * add Render Node
     * @param object 
     */
    addRenderObject(object: BaseRender): void {
        this._sceneManagerOBJ.addRenderObject(object);
    }

    /**
     * remove Render Node
     * @param object 
     */
    removeRenderObject(object: BaseRender): void {
        this._sceneManagerOBJ.removeRenderObject(object);
    }

    /**
     * remove motion Object
     * @param object 
     */
    removeMotionObject(object: BaseRender): void {
        this._sceneManagerOBJ.removeMotionObject(object);
    }

    /**
     * update All Motion Render Data
     */
    updateMotionObjects(): void {
        this._sceneManagerOBJ.updateMotionObjects();
    }

    /**
     * add motion Render Data
     * @param object 
     */
    addMotionObject(object: BaseRender): void {
        this._sceneManagerOBJ.addMotionObject(object);
    }

    /**
     * destroy
     */
    destroy(): void {
        this._sceneManagerOBJ.destroy();
    }

}