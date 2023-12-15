import { Vector4 } from "../maths/Vector4";
import { Texture } from "../resource/Texture";
import { Texture2D } from "../resource/Texture2D";
import { Filter } from "./Filter";
import { MaskFilterGLRender } from "./MaskFilterGLRender";

export class MaskFilter extends Filter {

 

    smooth:number;
    centerX :number;
    centerY :number;
    radius : number;

    
    _mask_vec : any[] = [];

    constructor(centerX :number = 0.5, centerY :number =0.5 ,radius : number =0,smooth :number =0)
    {
        super();
        this.centerX = centerX;
        this.centerY = centerY;
        this.smooth = smooth;
       this.radius = radius;
    

        this._glRender = new MaskFilterGLRender();

    }

    get type():number{
        return Filter.MASK;
    }

    


}