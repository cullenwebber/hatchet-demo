"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { Model } from "../Components/Hatchet-logo";
import { Float } from "@react-three/drei";
import { KernelSize, Resolution } from "postprocessing";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Suspense } from "react";

// Controls the zoom out on model load
const ZoomOutCamera = () => {
	const { camera } = useThree();
	useGSAP(
		() => {
			gsap.from(camera.position, {
				z: 0,
				duration: 2,
				ease: "power2.inOut",
			});

			gsap.from(camera.rotation, {
				z: Math.PI / -8,
				duration: 2,
				ease: "power2.inOut",
			});
		},
		{ dependencies: [camera] }
	);

	return null;
};

export default function ThreeJSCanvas() {
	return (
		<>
			<Canvas>
				<Suspense>
					<ZoomOutCamera />
					<Float
						speed={1}
						rotationIntensity={3}
						floatIntensity={1}
						floatingRange={[-0.2, 0.2]}
					>
						<Model />
					</Float>
					<EffectComposer>
						<Bloom
							intensity={2.0}
							kernelSize={KernelSize.LARGE}
							luminanceThreshold={0.1}
							luminanceSmoothing={0.025}
							resolutionX={Resolution.AUTO_SIZE}
							resolutionY={Resolution.AUTO_SIZE}
						/>
					</EffectComposer>
				</Suspense>
			</Canvas>
		</>
	);
}
