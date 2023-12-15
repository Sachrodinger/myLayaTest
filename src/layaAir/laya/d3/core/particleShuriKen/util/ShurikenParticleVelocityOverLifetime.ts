import { MathUtil } from "../../../../maths/MathUtil";
import { Vector3 } from "../../../../maths/Vector3";
import { Vector4 } from "../../../../maths/Vector4";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { GradientVelocity } from "../module/GradientVelocity";
import { ShurikenParticleExtension } from "./ShurikenParticleExtension";

export class ShurikenParticleVelocityOverLifetime {
    static updateVelocityLifetime(normalizedAge: number, particleSystem: ShurikenParticleSystem, Random1Y: number,Random1Z: number,Random1W: number) {
        let outVelocity: Vector3 = Vector3.ZERO.clone();
        const velocityOverLifetime = particleSystem.velocityOverLifetime;
        if (velocityOverLifetime && velocityOverLifetime.enable) {
            var velocity: GradientVelocity = velocityOverLifetime.velocity;
            var velocityType: number = velocity.type;
            switch (velocityType) {
                case 0:
                    outVelocity = velocity.constant;
                    break;
                case 1:
                    outVelocity.x = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientX._elements, normalizedAge)
                    outVelocity.y = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientY._elements, normalizedAge)
                    outVelocity.z = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientZ._elements, normalizedAge)
                    break;
                case 2:
                    outVelocity.x = MathUtil.lerp(velocity.constantMin.x, velocity.constantMax.x, Random1Y);
                    outVelocity.y = MathUtil.lerp(velocity.constantMin.y, velocity.constantMax.y, Random1Z);
                    outVelocity.z = MathUtil.lerp(velocity.constantMin.z, velocity.constantMax.z, Random1W);
                    break;
                case 3:
                    let curXMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientXMin._elements, normalizedAge)
                    let curYMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientYMin._elements, normalizedAge)
                    let curZMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientZMin._elements, normalizedAge)
                    let curXMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientXMax._elements, normalizedAge)
                    let curYMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientYMax._elements, normalizedAge)
                    let curZMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(velocity.gradientZMax._elements, normalizedAge)
                    outVelocity.x = MathUtil.lerp(curXMinValue, curXMaxValue, Random1Y);
                    outVelocity.y = MathUtil.lerp(curYMinValue, curYMaxValue, Random1Z);
                    outVelocity.z = MathUtil.lerp(curZMinValue, curZMaxValue, Random1W);
                    break;
                default:
                    break;
            }
        }
        return outVelocity;
    }

    // drag 未实装，不考虑
    static getStartPosition(startVelocity : Vector3,age:number)
    {
        let startPosition: Vector3 = Vector3.ZERO.clone();
        startPosition.x = startVelocity.x * age;
        startPosition.y = startVelocity.y * age;
        startPosition.z = startVelocity.z * age;
        return startPosition;
    }

    static computeParticleLifePosition(normalizedAge:number, particleSystem: ShurikenParticleSystem, Random1Y: number,Random1Z: number,Random1W: number,startLifetime:number)
    {
        let  age:number = startLifetime * normalizedAge;
        let lifePosition:Vector3 = Vector3.ZERO.clone();
        const velocityOverLifetime = particleSystem.velocityOverLifetime;
        if (velocityOverLifetime && velocityOverLifetime.enable) {
            var velocity: GradientVelocity = velocityOverLifetime.velocity;
            var velocityType: number = velocity.type;
            switch (velocityType) {
                case 0:
                    lifePosition.x = velocity.constant.x * age;
                    lifePosition.y = velocity.constant.y * age;
                    lifePosition.z = velocity.constant.z * age;
                    break;
                case 1:
                    lifePosition.x = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientX._elements, normalizedAge, startLifetime)
                    lifePosition.y = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientY._elements, normalizedAge, startLifetime)
                    lifePosition.z = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientZ._elements, normalizedAge, startLifetime)
                    break;
                case 2:
                    lifePosition.x = MathUtil.lerp(velocity.constantMin.x, velocity.constantMax.x, Random1Y)* age;
                    lifePosition.y = MathUtil.lerp(velocity.constantMin.y, velocity.constantMax.y, Random1Z)* age;
                    lifePosition.z = MathUtil.lerp(velocity.constantMin.z, velocity.constantMax.z, Random1W)* age;
                    break;
                case 3:
                    let curXMinValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientXMin._elements, normalizedAge,startLifetime)
                    let curYMinValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientYMin._elements, normalizedAge,startLifetime)
                    let curZMinValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientZMin._elements, normalizedAge,startLifetime)
                    let curXMaxValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientXMax._elements, normalizedAge,startLifetime)
                    let curYMaxValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientYMax._elements, normalizedAge,startLifetime)
                    let curZMaxValue = ShurikenParticleExtension.getTotalValueFromGradientFloat(velocity.gradientZMax._elements, normalizedAge,startLifetime)
                    lifePosition.x = MathUtil.lerp(curXMinValue, curXMaxValue, Random1Y);
                    lifePosition.y = MathUtil.lerp(curYMinValue, curYMaxValue, Random1Z);
                    lifePosition.z = MathUtil.lerp(curZMinValue, curZMaxValue, Random1W);
                    break;
                default:
                    break;
            }
            
        }
        return lifePosition;
    }
}