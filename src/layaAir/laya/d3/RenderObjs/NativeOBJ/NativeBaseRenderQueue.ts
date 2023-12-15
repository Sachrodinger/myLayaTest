import { UploadMemoryManager } from "../../../RenderEngine/RenderEngine/NativeGLEngine/CommonMemory/UploadMemoryManager";
import { IRenderContext3D } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderContext3D";
import { IRenderQueue } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderQueue";
import { ISortPass } from "../../../RenderEngine/RenderInterface/RenderPipelineInterface/ISortPass";
import { SingletonList } from "../../../utils/SingletonList";
import { BufferState } from "../../../webgl/utils/BufferState";
import { Camera } from "../../core/Camera";
import { RenderContext3D } from "../../core/render/RenderContext3D";
import { RenderElement } from "../../core/render/RenderElement";
import { RenderElementBatch } from "../../graphics/Batch/RenderElementBatch";


export class NativeBaseRenderQueue implements IRenderQueue {
   /** @interanl */
    _isTransparent: boolean = false;
   /** @internal */
   elements: SingletonList<RenderElement> = new SingletonList<RenderElement>();
   /**sort function*/
   _sortPass: ISortPass;
   /** context*/
   _context: IRenderContext3D;
   _batch: RenderElementBatch;
    private _nativeObj: any;
    set sortPass(value: ISortPass) {
        this._nativeObj.sortPass = value;
    }
    constructor(isTransparent: boolean) {
        this._isTransparent = isTransparent;
        this._nativeObj = new (window as any).conchRenderQueue(isTransparent);
 	    this._batch = RenderElementBatch.instance ? RenderElementBatch.instance : new RenderElementBatch();
    }

    batchAndUpdatePreAndSort(context: RenderContext3D): void {
        // TODO.
        throw new Error("Method not implemented.");
    }
    renderQueueOnly(context: RenderContext3D): number {
        // TODO.
        throw new Error("Method not implemented.");
    }
    recoverData(): void {
        // TODO.
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        this._nativeObj.destroy();
    }

    set context(value:RenderContext3D){
        this._context = value._contextOBJ;
    }

    addRenderElement(renderelement: RenderElement) {
        this.elements.add(renderelement);
    }

    clear(): void {
        this._nativeObj.clear();
        this.elements.length = 0;
    }

    renderQueue(context:RenderContext3D):number {
        this.context = context;
        this._context.applyContext(Camera._updateMark);
        
        var elements: RenderElement[] = this.elements.elements;

		this._batchQueue();
        this._nativeObj.clear();
        for (var i: number = 0, n: number = this.elements.length; i < n; i++){
            var render_element = elements[i];
            this._nativeObj.addRenderElement((render_element._renderElementOBJ as any)._nativeObj, 
            (render_element.render.renderNode as any)._nativeObj,
            render_element.material.renderQueue, 
            render_element.render.sortingFudge);
            render_element._renderUpdatePre(context);//Update Data
        }

        UploadMemoryManager.syncRenderMemory();

        BufferState._curBindedBufferState && BufferState._curBindedBufferState.unBind();
        this._nativeObj.renderQueue((this._context as any)._nativeObj);
        
        this._batch.recoverData();

        return n;
    }

    private _batchQueue() {
       this._isTransparent || this._batch.batch(this.elements);
    }
}