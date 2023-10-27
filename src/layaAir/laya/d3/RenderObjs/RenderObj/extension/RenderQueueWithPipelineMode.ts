import { IRenderQueue } from "../../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderQueue";
import { LayaGL } from "../../../../layagl/LayaGL";
import { RenderContext3D } from "../../../core/render/RenderContext3D";
import { RenderElement } from "../../../core/render/RenderElement";

export class RenderQueueWithPipelineMode {


    constructor(isTransparent: boolean) {
        this._queueWithPipelineMode = new Map<string, IRenderQueue>();
        this._isTransparent = isTransparent;
    }

    private _queueWithPipelineMode: Map<string, IRenderQueue>;
    private _isTransparent: boolean;

    addRenderElement(element: RenderElement, pipelineMode: string) {
        let q = this._queueWithPipelineMode.get(pipelineMode)
        if (q == null) {
            this._queueWithPipelineMode.set(pipelineMode, LayaGL.renderOBJCreate.createBaseRenderQueue(this._isTransparent));
            q = this._queueWithPipelineMode.get(pipelineMode)
        }
        q.addRenderElement(element);
    }

    renderQueue(context: RenderContext3D, pipelineMode: string): number {
        let q = this._queueWithPipelineMode.get(pipelineMode);
        if (q == null) {
            return 0;
        }
        let n = q.renderQueueOnly(context)
        return n;
    }

    recoverData() {
        this._queueWithPipelineMode.forEach(k => {
            k.recoverData();
        })
    }

    batchAndUpdatePreAndSort(context: RenderContext3D) {
        this._queueWithPipelineMode.forEach(k => {
            k.batchAndUpdatePreAndSort(context);
        })
    }

    clear() {
        this._queueWithPipelineMode.forEach(k => {
            k.clear();
        })
    }

}