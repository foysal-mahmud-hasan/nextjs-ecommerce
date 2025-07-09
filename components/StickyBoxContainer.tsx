"use client";

import { ComponentProps, ReactNode } from "react";
import Sticky from "react-sticky-el";

interface StickyBoxContainerProps extends ComponentProps<typeof Sticky> {
	children: ReactNode;
}

export default function StickyBoxContainer({ children, ...rest }: StickyBoxContainerProps) {
	return <Sticky {...rest}>{children}</Sticky>;
}
