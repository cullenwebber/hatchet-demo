"use client";
import { Canvas} from "@react-three/fiber";
import { Model } from "../Components/Hatchet-logo";
import { Environment, Float } from "@react-three/drei";
import { KernelSize, Resolution } from 'postprocessing'
import {
	Bloom,
	EffectComposer,
	Noise,
	Scanline,
} from "@react-three/postprocessing";

export default function Home() {
	return (
		<main className="">
			<Canvas>
				<Float
					speed={1} // Animation speed, defaults to 1
					rotationIntensity={3} // XYZ rotation intensity, defaults to 1
					floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
					floatingRange={[-0.2, 0.2]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
				>
					<Model />
				</Float>
				<Environment preset="lobby" />
				<EffectComposer>
					<Bloom
						intensity={7.0} // The bloom intensity.
						kernelSize={KernelSize.LARGE} // blur kernel size
						luminanceThreshold={0.1} // luminance threshold. Raise this value to mask out darker elements in the scene.
						luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
						mipmapBlur={true} // Enables or disables mipmap blur.
						resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
						resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
					/>
				</EffectComposer>
			</Canvas>
		</main>
	);
}
