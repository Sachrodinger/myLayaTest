import { Color } from "../../../../maths/Color";
import { MathUtil } from "../../../../maths/MathUtil";
import { Vector2 } from "../../../../maths/Vector2";
import { Vector3 } from "../../../../maths/Vector3";
import { Vector4 } from "../../../../maths/Vector4";
import { Gradient } from "../../Gradient";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { ShurikenParticleColorOverLifetime } from "./ShurikenParticleColorOverLifetime";
import { ShurikenParticleRotationOverLifetime } from "./ShurikenParticleRotationOverLifetime";
import { ShurikenParticleSizeOverLifetime } from "./ShurikenParticleSizeOverLifetime";
import { ShurikenParticleTextureSheetAnimation } from "./ShurikenParticleTextureSheetAnimation";
import { ShurikenParticleVelocityOverLifetime } from "./ShurikenParticleVelocityOverLifetime";

//*******IN*********//      //***************//      //*******OUT********//
// startLifetime    //      //               //      //                  //
// startColor       //      //               //      // outLifePos       //
// startSize        //      // overlifetime  //      // outColor         //
// startRotation    //      //     计算      //      // outSize          //
// random0          //      //               //      // outRotation      //
// random1          //      //               //      // outVelocity      //
//******************//      //***************//      //******************//

export class ShurikenParticleLifetimeData {
    /**
     * 输出overlifetime速度
     */
    static outVelocity: Vector3;
    /**
     * 输出overlifetime位置
     */
    static outLifePos: Vector3;
    /**
     * 输出overlifetime颜色
     */
    static outColor: Color;
    /**
     * 输出overlifetime大小
     */
    static outSize: Vector3;
    /**
     * 输出overlifetime旋转
     */
    static outRotation: Vector3;
    /**
     * 输出overlifetimeUV偏移
     */
    static outUVOffset: Vector2;
}

export class ShurikenParticlePerVertexData {
    /**
     * 输入的生命周期
     */
    static startLifetime: number;
    /**
     * 输入的随机值0
     */
    static random0: Vector4 = new Vector4();
    /**
     * 输入的随机值1
     */
    static random1: Vector4 = new Vector4();

    static setRandomValue(random: Vector4, vertices: Float32Array, index: number) {
        random.x = vertices[index];
        random.y = vertices[index + 1];
        random.z = vertices[index + 2];
        random.w = vertices[index + 3];
    }

    static setRandom0Value(vertices: Float32Array, index: number) {
        ShurikenParticlePerVertexData.random0.x = vertices[index];
        ShurikenParticlePerVertexData.random0.y = vertices[index + 1];
        ShurikenParticlePerVertexData.random0.z = vertices[index + 2];
        ShurikenParticlePerVertexData.random0.w = vertices[index + 3];
    }

    static setRandom1Value(vertices: Float32Array, index: number) {
        ShurikenParticlePerVertexData.random1.x = vertices[index];
        ShurikenParticlePerVertexData.random1.y = vertices[index + 1];
        ShurikenParticlePerVertexData.random1.z = vertices[index + 2];
        ShurikenParticlePerVertexData.random1.w = vertices[index + 3];
    }
}

export class ShurikenParticleExtension {
    static setPerVertexData(startLifetime: number, random0: Vector4, random1: Vector4) {
        ShurikenParticlePerVertexData.startLifetime = startLifetime;
        ShurikenParticlePerVertexData.random0 = random0;
        ShurikenParticlePerVertexData.random1 = random1;
    }

    static updateLifetimeModule(normalizeAge: number, particleSystem: ShurikenParticleSystem) {
        //更新overlifetime模块
        ShurikenParticleLifetimeData.outVelocity = ShurikenParticleVelocityOverLifetime.updateVelocityLifetime(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random1.y, ShurikenParticlePerVertexData.random1.z, ShurikenParticlePerVertexData.random1.w);
        ShurikenParticleLifetimeData.outLifePos = ShurikenParticleVelocityOverLifetime.computeParticleLifePosition(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random1.y, ShurikenParticlePerVertexData.random1.z, ShurikenParticlePerVertexData.random1.w, ShurikenParticlePerVertexData.startLifetime);
        ShurikenParticleLifetimeData.outColor = ShurikenParticleColorOverLifetime.updateColorOverLifetime(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random0.y);
        ShurikenParticleLifetimeData.outSize = ShurikenParticleSizeOverLifetime.updateSizeOverLifetime(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random0.z);
        ShurikenParticleLifetimeData.outRotation = ShurikenParticleRotationOverLifetime.updateRotationLifetime(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random0.w, ShurikenParticlePerVertexData.startLifetime);
        ShurikenParticleLifetimeData.outUVOffset = ShurikenParticleTextureSheetAnimation.updateTextureSheetAnimationFrame(normalizeAge, particleSystem, ShurikenParticlePerVertexData.random1.x)
    }

    static getCurValueFromGradientFloat(gradientNumbers: Float32Array, normalizedAge: number) {
        let curValue: number = 0;
        for (let i = 2; i < gradientNumbers.length; i += 2) {
            let gradientNumberX = gradientNumbers[i];
            let gradientNumberY = gradientNumbers[i + 1];
            let key: number = gradientNumberX;
            if (key >= normalizedAge) {
                let lastGradientNumberX = gradientNumbers[i - 2];
                let lastGradientNumberY = gradientNumbers[i - 1];
                let lastKey = lastGradientNumberX;
                let age = (normalizedAge - lastKey) / (key - lastKey);
                curValue = MathUtil.lerp(lastGradientNumberY, gradientNumberY, age);
                break;
            }
        }
        return curValue;
    }

    static getTotalValueFromGradientFloat(gradientNumbers: Float32Array, normalizedAge: number, startLifeTime: number) {
        let totalValue: number = 0;
        for (let i = 2; i < gradientNumbers.length; i += 2) {
            let gradientNumberX = gradientNumbers[i];
            let gradientNumberY = gradientNumbers[i + 1];
            let key: number = gradientNumberX;

            let lastGradientNumberX = gradientNumbers[i - 2];
            let lastGradientNumberY = gradientNumbers[i - 1];
            let lastKey = lastGradientNumberX;
            if (key >= normalizedAge) {
                let age = (normalizedAge - lastKey) / (key - lastKey);
                totalValue += (lastGradientNumberY + MathUtil.lerp(lastGradientNumberY, gradientNumberY, age)) / 2.0 * startLifeTime * (normalizedAge - lastKey);
                break;
            }
            else {
                totalValue += (lastGradientNumberY + gradientNumberY) / 2.0 * startLifeTime * (key - lastGradientNumberX);
            }
        }

        let endKey = gradientNumbers[gradientNumbers.length - 2];
        if(endKey < 1.0)
        {
            if(normalizedAge > endKey)
            {
                totalValue += gradientNumbers[gradientNumbers.length - 1] * startLifeTime * (normalizedAge - endKey);
            } 
        }
        return totalValue;
    }

    static clampMinMax(a:number,min:number,max:number):number
    {
        if(min > max)
        {
            let temp = max;
            max = min;
            min = temp;
        }
        if(a > max)
        {
            return max;
        }else if(a<min)
        {
            return min;
        }else
        {
            return a;
        }
    }

    static getColorFromGradient(gradient: Gradient, normalizedAge: number) {
        let curColor: Color = Color.WHITE.clone();
        
        let ranges = gradient._keyRanges;
        let gradientColors = gradient._rgbElements;
        let gradientAlphas = gradient._alphaElements;
        
        ranges.setValue(1, 0, 1, 0);
        for (let index = 0; index < gradient.colorRGBKeysCount; index++) {
                    let colorKey = gradientColors[index * 4];
                    ranges.x = Math.min(ranges.x, colorKey);
                    ranges.y = Math.max(ranges.y, colorKey);
        }
        for (let index = 0; index < gradient.colorAlphaKeysCount; index++) {
            let alphaKey = gradientAlphas[index * 2];
            ranges.z = Math.min(ranges.z, alphaKey);
            ranges.w = Math.max(ranges.w, alphaKey);
        }

        let alphaAge = ShurikenParticleExtension.clampMinMax(normalizedAge,ranges.z,ranges.w);
        for (let i = 2; i < gradientAlphas.length; i += 2) {
            let alphaKey: number = gradientAlphas[i];
            if (alphaKey >= alphaAge) {
                let lastAlphaKey = gradientAlphas[i - 2];
                let age = (alphaAge - lastAlphaKey) / (alphaKey - lastAlphaKey);
                let lastGradientAlphaY = gradientAlphas[i - 1];
                let gradientAlphaY = gradientAlphas[i + 1]

                curColor.a = MathUtil.lerp(lastGradientAlphaY, gradientAlphaY, age);
                break;
            }  
        }

        let colorAge = ShurikenParticleExtension.clampMinMax(normalizedAge,ranges.x,ranges.y);
        for (let i = 4; i < gradientColors.length; i += 4) {
            let colorKey: number = gradientColors[i];
            if (colorKey >= colorAge) {
                let lastColorKey = gradientColors[i - 4];
                let age = (colorAge - lastColorKey) / (colorKey - lastColorKey);

                let lastGradientColorR = gradientColors[i - 3];
                let gradientColorR = gradientColors[i + 1];

                let lastGradientColorG = gradientColors[i - 2];
                let gradientColorG = gradientColors[i + 2];

                let lastGradientColorB = gradientColors[i - 1];
                let gradientColorB = gradientColors[i + 3]

                curColor.r = MathUtil.lerp(lastGradientColorR, gradientColorR, age);
                curColor.g = MathUtil.lerp(lastGradientColorG, gradientColorG, age);
                curColor.b = MathUtil.lerp(lastGradientColorB, gradientColorB, age);
                break;
            }  
        }
        return curColor;
    }
}
