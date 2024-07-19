"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Model } from "../Components/Hatchet-logo";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { BlendFunction } from "postprocessing";
import { EffectComposer, Noise, Scanline } from "@react-three/postprocessing";

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
			</Canvas>
		</main>
	);
}
