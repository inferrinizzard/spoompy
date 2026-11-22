"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const StyledComponentsRegistry: React.FC<React.PropsWithChildren<unknown>> = ({
	children,
}) => {
	// Only create stylesheet once with lazy initial state
	// x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
	const [styledComponentsStyleSheet, setStyledComponentsStyleSheet] = useState(
		() => new ServerStyleSheet(),
	);

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return <>{styles}</>;
	});

	if (typeof window !== "undefined") return <>{children}</>;

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			{children}
		</StyleSheetManager>
	);
};

export default StyledComponentsRegistry;
