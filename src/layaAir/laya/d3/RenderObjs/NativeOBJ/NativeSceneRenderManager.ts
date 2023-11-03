import { ISceneRenderManager } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/ISceneRenderManager";
import { SingletonList } from "../../../utils/SingletonList";
import { BaseRender } from "../../core/render/BaseRender";



export class NativeSceneRenderManager implements ISceneRenderManager {
    /** @internal */
    _rendersWithCullingMask: Map<number, SingletonList<BaseRender>> = new Map<number, SingletonList<BaseRender>>;
    /** @internal */
    _renders: SingletonList<BaseRender> = new SingletonList();
    //自定义更新的Bounds渲染节点
    _customUpdateList: SingletonList<BaseRender> = new SingletonList();
    //自定义裁剪的渲染节点
    _customCullList: SingletonList<BaseRender> = new SingletonList();
    private _nativeObj: any;
    constructor() {
        this._nativeObj = new (window as any).conchSceneCullManger();
    }

    get list() {
        return this._renders;
    }

    set list(value) {
        this._customCullList.elements = [];
        this._customCullList.length = 0;
        this._nativeObj.clear();  
        this._renders.clear();
        for (let i = 0, len = value.length; i < len; i++) {
            this.addRenderObject((value.elements[i] as BaseRender));
        }
    }
    

    get map() {
        return this._rendersWithCullingMask;
    }

    set map(value){

    }

    addRenderObject(object: BaseRender): void {
        
        this._renders.add(object);
        if (!object._customCull && object.renderNode.geometryBounds) {
            this._nativeObj.addRenderObject((object.renderNode as any)._nativeObj);
        }
        else {
             this._customCullList.add(object);
        }

    }

    removeRenderObject(object: BaseRender): void {
        
        if (!object._customCull && object.renderNode.geometryBounds) {
            this._nativeObj.removeRenderObject((object.renderNode as any)._nativeObj);
        }
        else {
            //remove
            let elements = this._customCullList.elements;
            let index = elements.indexOf(object);
            if (index < this._customCullList.length) {
                this._customCullList.length -= 1;
                elements[index] = elements[this._customCullList.length];
            }
        }
        this._renders.remove(object);
        this.removeMotionObject(object);
    }

    removeMotionObject(object: BaseRender): void {
        
        if (object.renderNode.geometryBounds) {
            //可以在native更新Bounds的渲染节点
            this._nativeObj.removeMotionObject((object.renderNode as any)._nativeObj);
        } else {
            let index = object._motionIndexList;
            if (index != -1) {//remove
                let elements = this._customUpdateList.elements;
                this._customUpdateList.length -= 1;
                elements[length]._motionIndexList = index;
                elements[index] = elements[length];
            }
        }
    }

    updateMotionObjects(): void {
        
        //update native Motion Node
        this._nativeObj.updateMotionObjects();

        for (let i = 0; i < this._customUpdateList.length; i++) {
            this._customUpdateList.elements[i].bounds;
            this._customUpdateList.elements[i]._motionIndexList = -1;
        }
        this._customUpdateList.length = 0;
    }

    addMotionObject(object: BaseRender): void {
        
        if (object.renderNode.geometryBounds) {
            this._nativeObj.addMotionObject((object.renderNode as any)._nativeObj);
        } else {
            if (object._motionIndexList == -1) {
                object._motionIndexList = this._customUpdateList.length;
                this._customUpdateList.add(object);
            }
        }
    }

    destroy(): void {
        this._nativeObj.destroy(); 
        this._renders.destroy();
        //Destroy
        this._customUpdateList.destroy();
        this._customCullList.destroy();
    }

}