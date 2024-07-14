import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

export function Model(props) {
	const group = useRef(null);
	const star = useRef(null);
	const semi = useRef(null);

	useGSAP(() => {
		if (group.current) {
			let tl = gsap.timeline({
				defaults: {
					ease: "power2.out",
					duration: 2,
				},
			});

			tl.to(
				group.current.position,
				{
					y: 0.4,
					x: -0.2,
				},
				"<="
			)
				.to(group.current.rotation, {
					y: Math.PI * 5.5,
					duration: 3,
				})
				.from(
					group.current.scale,
					{
						x: 0,
						y: 0,
						z: 0,
						duration: 4,
					},
					"<="
				)
				.to(
					star.current.position,
					{
						y: -1.2,
						z: 1.3,
					},
					"<=95%"
				)
				.to(
					star.current.rotation,
					{
						x: Math.PI / 2.5,
					},
					"<="
				)
				.to(
					semi.current.position,
					{
						y: -0.7,
						z: 1.1,
					},
					"<="
				)
				.to(
					semi.current.rotation,
					{
						x: Math.PI / 2.5,
					},
					"<="
				);
		}
	});

	const { nodes, materials } = useGLTF("/start-logo.glb");
	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				ref={semi}
				castShadow
				receiveShadow
				geometry={nodes.Semi_Circle.geometry}
				position={[0, -0.93, 1.195]}
				rotation={[Math.PI / 2, 0, -Math.PI / 2]}
				scale={9.773}
			>
				<meshStandardMaterial color="#fff" metalness={1} roughness={0.2} />
			</mesh>
			<mesh
				ref={star}
				castShadow
				receiveShadow
				geometry={nodes.Star.geometry}
				position={[0, -0.93, 1.195]}
				rotation={[Math.PI / 2, 0, -Math.PI / 2]}
				scale={9.773}
			>
				<meshStandardMaterial color="#fff" metalness={1} roughness={0.2} />
			</mesh>
		</group>
	);
}

useGLTF.preload("/start-logo.glb");
