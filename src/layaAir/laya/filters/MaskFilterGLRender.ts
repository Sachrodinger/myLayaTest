import { Matrix } from "../maths/Matrix";
import { Context } from "../resource/Context";
import { RenderTexture2D } from "../resource/RenderTexture2D";
import { ShaderDefines2D } from "../webgl/shader/d2/ShaderDefines2D";
import { Value2D } from "../webgl/shader/d2/value/Value2D";
import { Filter } from "./Filter";
import { MaskFilter } from "./MaskFilter";

export class MaskFilterGLRender{
    render(rt :RenderTexture2D ,ctx :Context ,width :number , height:number , filter:MaskFilter):void {
        var shadervalue :Value2D = Value2D.create(ShaderDefines2D.TEXTURE2D , 0);
        this.setShaderInfo(shadervalue , filter);
        ctx.drawTarget(rt , 0,0,width ,height , Matrix.EMPTY.identity() , shadervalue);

    }
    setShaderInfo(shader:Value2D , filter:MaskFilter )
    {
        shader.defines.add(Filter.MASK);
        shader.defines.add(Filter.FILTERCANCEL);
        var sv:any  = (<any>shader);
        filter._mask_vec[0] = filter.centerX;
        filter._mask_vec[1] = filter.centerY;
        filter._mask_vec[2] = filter.radius;
        filter._mask_vec[3] = filter.smooth;
        sv._mask_vec = filter._mask_vec;
    }

}
