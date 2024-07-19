import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export function Model(props) {
	const pointsRef1 = useRef();
	const pointsRef2 = useRef();
	const waveFactor = useRef(0);
	const [isHovered, setIsHovered] = useState(false);
	const hoverValue = useRef(0.05);

	const pointsMaterial = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					color: { value: new THREE.Color("#cd001a") },
					size: { value: 0.15 },
					time: { value: 0 },
					hover: { value: 0 },
					emissive: { value: new THREE.Color("#cd001a") },
				},
				vertexShader: `
          uniform float time;
          uniform float hover;
          varying vec3 vPosition;

          // Simplex noise implementation
          vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
          }

          vec4 taylorInvSqrt(vec4 r) {
            return 1.79284291400159 - 0.85373472095314 * r;
          }

          float snoise(vec3 v) { 
            const vec2  C = vec2(1.0/6.0, 1.0/3.0);
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            i = mod289(i);
            vec4 p = permute(permute(permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);

            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);

            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
          }

          void main() {
            vPosition = position;
            float noise = snoise(position + time);
            float delay = snoise(position) * 2.0; // Delay based on noise, can adjust range as needed
            float adjustedTime = max(0.0, time - delay);
            float explosionFactor = hover;
            vec3 newPosition = position + normal * tan(position.y * 0.2 + adjustedTime * 0.9999) * noise * explosionFactor;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            gl_PointSize = 1.25;
          }
        `,
				fragmentShader: `
          uniform vec3 color;
          uniform vec3 emissive;
          void main() {
            vec3 finalColor = color + emissive;
            gl_FragColor = vec4(finalColor, 2.0);
          }
        `,
			}),
		[]
	);

	const { nodes } = useGLTF("/hatchet-logo.glb");

	useEffect(() => {
		const hoverTarget = { value: hoverValue.current };
		gsap.to(hoverTarget, {
			value: isHovered ? 0.4 : 0.05,
			duration: 0.4,
			ease: "power2",
			onUpdate: () => {
				hoverValue.current = hoverTarget.value;
			},
		});
	}, [isHovered]);

	useFrame((state, delta) => {
		waveFactor.current += delta;
		if (pointsRef1.current && pointsRef2.current) {
			pointsRef1.current.material.uniforms.time.value = waveFactor.current;
			pointsRef1.current.material.uniforms.hover.value = hoverValue.current;

			pointsRef2.current.material.uniforms.time.value = waveFactor.current;
			pointsRef2.current.material.uniforms.hover.value = hoverValue.current;
		}
	});

	return (
		<group
			{...props}
			dispose={null}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
		>
			<points
				ref={pointsRef1}
				geometry={nodes.Curve.geometry}
				material={pointsMaterial}
				scale={0.6}
			/>
			<points
				ref={pointsRef2}
				geometry={nodes.Curve001.geometry}
				material={pointsMaterial}
				scale={0.6}
			/>
		</group>
	);
}

useGLTF.preload("/hatchet-logo.glb");
