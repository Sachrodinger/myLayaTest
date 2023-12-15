import { MathUtil } from "../../../../maths/MathUtil";
import { Vector2 } from "../../../../maths/Vector2";
import { ShurikenParticleSystem } from "../ShurikenParticleSystem";
import { FrameOverTime } from "../module/FrameOverTime";
import { ShurikenParticleExtension } from "./ShurikenParticleExtension";

export class ShurikenParticleTextureSheetAnimation {
    static updateTextureSheetAnimationFrame(normalizedAge: number, particleSystem: ShurikenParticleSystem, animRandom: number) {
        let outUVOffset = Vector2.ZERO.clone();
        const textureSheetAnimation = particleSystem.textureSheetAnimation;
        if (textureSheetAnimation && textureSheetAnimation.enable) {
            const TSACycles = textureSheetAnimation.cycles;
            const TSASubUVLengthX = 1.0 / textureSheetAnimation.tiles.x;
            const TSASubUVLengthY = 1.0 / textureSheetAnimation.tiles.y;
            const cycleNormalizedAge = normalizedAge * TSACycles;
            const uvNormalizedAge = cycleNormalizedAge - Math.floor(cycleNormalizedAge);
            
            var frameOverTime: FrameOverTime = textureSheetAnimation.frame;
            var textureAniType: number = frameOverTime.type;
            switch (textureAniType) {
                case 1:
                    let frame = ShurikenParticleExtension.getCurValueFromGradientFloat(frameOverTime.frameOverTimeData._elements, uvNormalizedAge);
                    frame = Math.floor(frame);
                    let totalULength = frame * TSASubUVLengthX;
                    let floorTotalULength = Math.floor(totalULength);
                    outUVOffset.x += totalULength - floorTotalULength;
                    outUVOffset.y += floorTotalULength * TSASubUVLengthY;
                    break;
                case 3:
                    let curMinValue = ShurikenParticleExtension.getCurValueFromGradientFloat(frameOverTime.frameOverTimeDataMin._elements, uvNormalizedAge)
                    let curMaxValue = ShurikenParticleExtension.getCurValueFromGradientFloat(frameOverTime.frameOverTimeDataMax._elements, uvNormalizedAge)
                    let frameR = MathUtil.lerp(curMinValue, curMaxValue, animRandom);
                    frameR = Math.floor(frameR);
                    let totalULengthR = frameR * TSASubUVLengthX;
                    let floorTotalULengthR = Math.floor(totalULengthR);
                    outUVOffset.x += totalULengthR - floorTotalULengthR;
                    outUVOffset.y += floorTotalULengthR * TSASubUVLengthY;
                    break;
                default:
                    break;
            }
        }

        return outUVOffset;
    }

}