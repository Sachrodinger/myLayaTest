import { ISceneRenderManager } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/ISceneRenderManager";
import { SingletonList } from "../../../utils/SingletonList";
import { BaseRender } from "../../core/render/BaseRender";


export class SceneRenderManagerOBJ implements ISceneRenderManager {
    /** @internal */
    _rendersWithCullingMask: Map<number, SingletonList<BaseRender>> = new Map<number, SingletonList<BaseRender>>();
    /** @internal */
    _renders: SingletonList<BaseRender> = new SingletonList();
    _motionRenders: SingletonList<BaseRender> = new SingletonList();
    constructor() {

    }

    get list() {
        return this._renders;
    }

    set list(value) {
        this._renders = value;
    }

    get map() {
        return this._rendersWithCullingMask;
    }

    set map(value){

    }

    addRenderObject(object: BaseRender): void {
        // this._renders.add(object);
        if(!this._rendersWithCullingMask.has(object.renderNode.layer)){
            this._rendersWithCullingMask.set(object.renderNode.layer,new SingletonList<BaseRender>)
        }
        this._rendersWithCullingMask.get(object.renderNode.layer).add(object);
    }
    removeRenderObject(object: BaseRender): void {
        // this._renders.remove(object);
        if(this._rendersWithCullingMask.has(object.renderNode.layer)){
            this._rendersWithCullingMask.get(object.renderNode.layer).remove(object);
        }
        this.removeMotionObject(object);
    }

    removeMotionObject(object: BaseRender): void {
        let index = object._motionIndexList;
        if (index != -1) {//remove
            let elements = this._motionRenders.elements;
            this._motionRenders.length -= 1;
            elements[length]._motionIndexList = index;
            elements[index] = elements[length];
        }

        //TODO
    }
    updateMotionObjects(): void {
        for (let i = 0; i < this._motionRenders.length; i++) {
            this._motionRenders.elements[i].bounds;
            this._motionRenders.elements[i]._motionIndexList = -1;
        }
        this._motionRenders.length = 0;

        //TODO
    }
    addMotionObject(object: BaseRender): void {
        if (object._motionIndexList == -1) {
            object._motionIndexList = this._motionRenders.length;
            this._motionRenders.add(object);
        }

        //TODO
    }
    destroy(): void {
        this._renders.destroy();
    }

}