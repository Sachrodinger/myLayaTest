import { Sprite } from "../../display/Sprite";
import { ColliderBase } from "./ColliderBase";
import { Physics2D } from "../Physics2D";

/**
 * 2D圆形碰撞体
 */
export class CircleCollider extends ColliderBase {
    /**@private */
    private static _temp: any;
    /**相对节点的x轴偏移*/
    private _x: number = 0;
    /**相对节点的y轴偏移*/
    private _y: number = 0;
    /**圆形半径，必须为正数*/
    private _radius: number = 50;
    /**
     * @override
     */
    protected getDef(): any {
        if (!this._shape) {
            this._shape = Physics2D.I._factory.create_CircleShape();
            this._setShape(false);
        }
        this.label = (this.label || "CircleCollider");
        return super.getDef();
    }
    /**
     * @override 初始化设置为当前显示对象的宽和高
     */
    protected _onAdded(): void {
        let node = this.owner as Sprite;
        if (node && 0 < node.width && 0 < node.height) {
            if (50 == this._radius) {
                this._radius = node.width >> 1;
            }
        }
    }

    private _setShape(re: boolean = true): void {
        var scale: number = (this.owner as any)["scaleX"] || 1;
        Physics2D.I._factory.set_CircleShape_radius(this._shape, this.radius * scale);
        Physics2D.I._factory.set_CircleShape_pos(this._shape, this._x * scale, this._y * scale)
        if (re) this.refresh();
    }

    /**相对节点的x轴偏移*/
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
        if (this._shape) this._setShape();
    }

    /**相对节点的y轴偏移*/
    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
        if (this._shape) this._setShape();
    }

    /**圆形半径，必须为正数*/
    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        if (value <= 0) throw "CircleCollider radius cannot be less than 0";
        this._radius = value;
        if (this._shape) this._setShape();
    }

    /**@private 重置形状
     * @override
    */
    resetShape(re: boolean = true): void {
        this._setShape();
    }
}