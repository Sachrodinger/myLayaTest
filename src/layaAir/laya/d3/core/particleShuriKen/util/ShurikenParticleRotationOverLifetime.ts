import { MathUtil } from "../../../../maths/MathUtil";
import { Vector3 } from "../../../../maths/Vector3";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { GradientAngularVelocity } from "../module/GradientAngularVelocity";
import { ShurikenParticleExtension } from "./ShurikenParticleExtension";

export class ShurikenParticleRotationOverLifetime {
    static updateRotationLifetime(normalizedAge: number, particleSystem: ShurikenParticleSystem, rotationRandom: number,startLifetime: number) {
        let age = startLifetime * normalizedAge;
        let outTotalRotation: Vector3 = Vector3.ZERO.clone();
        const rotationOverLifetime = particleSystem.rotationOverLifetime;
        if (rotationOverLifetime && rotationOverLifetime.enable) {
            var rotation: GradientAngularVelocity = rotationOverLifetime.angularVelocity;
            var rotationSeparate: boolean = rotation.separateAxes;
            var rotationType: number = rotation.type;
            switch (rotationType) {
                case 0:
                    if (rotationSeparate) {
                        Vector3.scale(rotation.constantSeparate,age,outTotalRotation);
                    }
                    else {
                        outTotalRotation.x = outTotalRotation.y = outTotalRotation.z = rotation.constant * age;
                    }
                    break;
                case 1:
                    if (rotationSeparate) {
                        outTotalRotation.x = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientX._elements, normalizedAge,startLifetime)
                        outTotalRotation.y = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientY._elements, normalizedAge,startLifetime)
                        outTotalRotation.z = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientZ._elements, normalizedAge,startLifetime)
                    }
                    else {
                        outTotalRotation.x = outTotalRotation.y = outTotalRotation.z = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradient._elements, normalizedAge,startLifetime)
                    }
                    break;
                case 2:
                    if (rotationSeparate) {
                        outTotalRotation.x = MathUtil.lerp(rotation.constantMinSeparate.x, rotation.constantMaxSeparate.x, rotationRandom)* age;
                        outTotalRotation.y = MathUtil.lerp(rotation.constantMinSeparate.y, rotation.constantMaxSeparate.y, rotationRandom)* age;
                        outTotalRotation.z = MathUtil.lerp(rotation.constantMinSeparate.z, rotation.constantMaxSeparate.z, rotationRandom)* age;
                    }
                    else {
                        outTotalRotation.x = outTotalRotation.y = outTotalRotation.z = MathUtil.lerp(rotation.constantMin, rotation.constantMax, rotationRandom)* age;
                    }
                    break;
                case 3:
                    if (rotationSeparate) {
                        let curMinXValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientXMin._elements, normalizedAge,startLifetime)
                        let curMinYValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientYMin._elements, normalizedAge,startLifetime)
                        let curMinZValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientZMin._elements, normalizedAge,startLifetime)
                        let curMaxXValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientXMax._elements, normalizedAge,startLifetime)
                        let curMaxYValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientYMax._elements, normalizedAge,startLifetime)
                        let curMaxZValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientZMax._elements, normalizedAge,startLifetime)
                        outTotalRotation.x = MathUtil.lerp(curMinXValue, curMaxXValue, rotationRandom);
                        outTotalRotation.y = MathUtil.lerp(curMinYValue, curMaxYValue, rotationRandom);
                        outTotalRotation.z = MathUtil.lerp(curMinZValue, curMaxZValue, rotationRandom);
                    }
                    else {
                        let curMinValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientMin._elements, normalizedAge,startLifetime)
                        let curMaxValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(rotation.gradientMax._elements, normalizedAge,startLifetime)
                        outTotalRotation.x = outTotalRotation.y = outTotalRotation.z = MathUtil.lerp(curMinValue, curMaxValue, rotationRandom);
                    }
                    break;
                default:
                    break;
            }
        }
        return outTotalRotation;
    }
}