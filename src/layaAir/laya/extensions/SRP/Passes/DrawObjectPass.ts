import { ILaya3D } from "../../../../ILaya3D";
import { CameraEventFlags } from "../../../d3/core/Camera";
import { RenderContext3D } from "../../../d3/core/render/RenderContext3D";
import { Scene3D } from "../../../d3/core/scene/Scene3D";
import { Stat } from "../../../utils/Stat";
import { RenderPassBase } from "../Runtime/RenderPassBase";
import { RendererBase } from "../Runtime/RendererBase";

export class DrawObjectPass extends RenderPassBase {

    private isOpaque: boolean;
    private cullingMask: number;
    constructor(event: CameraEventFlags, isOpaque: boolean, cullingMask: number) {
        super(event);
        this.pipelineMode = ["Forward"];
        this.isOpaque = isOpaque
        if (this.isOpaque) {
            this.passName = "opaque"
        } else {
            this.passName = "transparent"
        }
        this.cullingMask = cullingMask;
    }

    public Execute(context: RenderContext3D, scene: Scene3D, renderer: RendererBase): void {
        // renderer.recoverRenderContext3D(context,renderer.activeRenderTarget);
        //设置目标rt

        this.pipelineMode.forEach(mode => {
            if (this.isOpaque) {
                Stat.enableOpaque && renderer._drawRenderer(context, ILaya3D.Scene3D.SCENERENDERFLAG_RENDERQPAQUE, mode);
            } else {
                Stat.enableTransparent && renderer._drawRenderer(context, ILaya3D.Scene3D.SCENERENDERFLAG_RENDERTRANSPARENT, mode);
            }
        });

    }

}