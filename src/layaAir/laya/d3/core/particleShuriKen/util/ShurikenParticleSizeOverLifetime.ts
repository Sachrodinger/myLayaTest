import { MathUtil } from "../../../../maths/MathUtil";
import { Vector3 } from "../../../../maths/Vector3";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { GradientSize } from "../module/GradientSize";
import { ShurikenParticleExtension } from "./ShurikenParticleExtension";

export class ShurikenParticleSizeOverLifetime {

    static updateSizeOverLifetime(normalizedAge: number, particleSystem: ShurikenParticleSystem, sizeRandom: number) {
        let outLifeSize: Vector3 = Vector3.ONE.clone();
        const sizeOverLifetime = particleSystem.sizeOverLifetime;
        if (sizeOverLifetime && sizeOverLifetime.enable) {
            var size: GradientSize = sizeOverLifetime.size;
            var sizeSeparate: boolean = size.separateAxes;
            var sizeType: number = size.type;
            switch (sizeType) {
                case 0:
                    if (sizeSeparate) {
                        outLifeSize.x = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientX._elements, normalizedAge)
                        outLifeSize.y = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientY._elements, normalizedAge)
                        outLifeSize.z = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientZ._elements, normalizedAge)
                    }
                    else {
                        let curValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradient._elements, normalizedAge)
                        outLifeSize.x = curValue;
                        outLifeSize.y = curValue;
                        outLifeSize.z = curValue;
                    }
                    break;
                case 2:
                    if (sizeSeparate) {
                        let curXMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientXMin._elements, normalizedAge)
                        let curYMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientYMin._elements, normalizedAge)
                        let curZMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientZMin._elements, normalizedAge)
                        let curXMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientXMax._elements, normalizedAge)
                        let curYMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientYMax._elements, normalizedAge)
                        let curZMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientZMax._elements, normalizedAge)
                        outLifeSize.x = MathUtil.lerp(curXMinValue, curXMaxValue, sizeRandom);
                        outLifeSize.y = MathUtil.lerp(curYMinValue, curYMaxValue, sizeRandom);
                        outLifeSize.z = MathUtil.lerp(curZMinValue, curZMaxValue, sizeRandom);
                    }
                    else {
                        let curMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientMin._elements, normalizedAge)
                        let curMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(size.gradientMax._elements, normalizedAge)
                        let resultValue = MathUtil.lerp(curMinValue, curMaxValue, sizeRandom)
                        outLifeSize.x = resultValue;
                        outLifeSize.y = resultValue;
                        outLifeSize.z = resultValue;

                    }
                    break;
                default:
                    break;
            }
        }
        return outLifeSize;
    }
}