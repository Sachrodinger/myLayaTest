import { Laya } from "Laya";
import { Sprite } from "laya/display/Sprite";
import { MaskFilter } from "laya/filters/MaskFilter";
import { Texture } from "laya/resource/Texture";
import { Browser } from "laya/utils/Browser";
import { Handler } from "laya/utils/Handler";
import { WebGL } from "laya/webgl/WebGL";
import { Main } from "./../Main";
import { Stage } from "laya/display/Stage";
import { TouchScriptSample } from "../3d/LayaAir3D_MouseInteraction/TouchScriptSample";
import { Vector4 } from "laya/maths/Vector4";

export class Filters_Mask{
	private ApePath: string = "res/apes/monkey2.png";

	private ape: Sprite;

	Main:typeof Main = null;

	constructor(maincls: typeof Main){
		this.Main = maincls;
		Laya.init(Browser.clientWidth ,Browser.clientHeight ,WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = "showall";
		Laya.stage.bgColor = "#232628";
		Laya.loader.load(this.ApePath , Handler.create(this, this.setup));

	}

	private setup(e : any = null) :void{
		
		this.ape = new Sprite();
		this.ape.loadImage(this.ApePath);

		this.Main.box2D.addChild(this.ape);
		
		var maskFilter : MaskFilter = new MaskFilter();
		this.ape.filters = [maskFilter];


	}
}