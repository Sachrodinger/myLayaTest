import { Color } from "../../../../maths/Color";
import { MathUtil } from "../../../../maths/MathUtil";
import { Vector3 } from "../../../../maths/Vector3";
import { Vector4 } from "../../../../maths/Vector4";
import { Rand } from "../../../math/Rand";
import { ShurikenParticleData } from "../ShurikenParticleData";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { GradientColor } from "../module/GradientColor";
import { ShurikenParticleExtension } from "./ShurikenParticleExtension";

export class ShurikenParticleColorOverLifetime {
    static minGradientColor: Color = new Color();
    static maxGradientColor: Color = new Color();

    static updateColorOverLifetime(normalizedAge: number, particleSystem: ShurikenParticleSystem, colorRandom: number) {
        let outLifeColor: Color = Color.WHITE.clone();
        const colorOverLifetime = particleSystem.colorOverLifetime;
        if (colorOverLifetime && colorOverLifetime.enable) {
            var color: GradientColor = colorOverLifetime.color;
            switch (color.type) {
                case 1:
                    //TODO
                    let colorGradient = color.gradient;
                    if(colorGradient)
                    outLifeColor = ShurikenParticleExtension.getColorFromGradient(colorGradient,normalizedAge);
                    break;
                case 3:
                    //TODO:GC
                    //min color
                    let minGradien = color.gradientMin;
                    if(minGradien)
                    ShurikenParticleColorOverLifetime.minGradientColor = ShurikenParticleExtension.getColorFromGradient(minGradien,normalizedAge);

                    //max color
                    let maxGradien = color.gradientMax;
                    if(maxGradien)
                    ShurikenParticleColorOverLifetime.maxGradientColor = ShurikenParticleExtension.getColorFromGradient(maxGradien,normalizedAge);

                    outLifeColor.r = MathUtil.lerp(ShurikenParticleColorOverLifetime.minGradientColor.r, ShurikenParticleColorOverLifetime.maxGradientColor.r, colorRandom);
                    outLifeColor.g = MathUtil.lerp(ShurikenParticleColorOverLifetime.minGradientColor.g, ShurikenParticleColorOverLifetime.maxGradientColor.g, colorRandom);
                    outLifeColor.b = MathUtil.lerp(ShurikenParticleColorOverLifetime.minGradientColor.b, ShurikenParticleColorOverLifetime.maxGradientColor.b, colorRandom);
                    outLifeColor.a = MathUtil.lerp(ShurikenParticleColorOverLifetime.minGradientColor.a, ShurikenParticleColorOverLifetime.maxGradientColor.a, colorRandom);
                    
                    break;
            }
        }
        outLifeColor.r = Color.linearToGammaSpace(outLifeColor.r);
        outLifeColor.g = Color.linearToGammaSpace(outLifeColor.g);
        outLifeColor.b = Color.linearToGammaSpace(outLifeColor.b);
        return outLifeColor ;
    }
}