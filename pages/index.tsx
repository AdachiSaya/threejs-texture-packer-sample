import { useEffect, useRef } from 'react';
import { Main } from '../assets/main';

export default function Index() {
	const mainVisualRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!mainVisualRef.current) return;
		const main = new Main();
		main.init(mainVisualRef.current);
	}, []);
	return (
		<div ref={mainVisualRef} style={{ width: "100%", height: "100vh" }} />
	);
}
