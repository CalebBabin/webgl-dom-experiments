

export const getElementPosition = (element) => {
	const rect = element.getBoundingClientRect();

	// the center of the viewport at scroll position 0 will translate to {x: 0, y: 0} in three.js,
	// meaning the top of the viewport will be at { x: 0, y: -0.5 }

	return {
		height: rect.height / window.innerHeight,
		width: rect.width / window.innerHeight,
		top: -(rect.top + rect.height / 2 + window.scrollY) / window.innerHeight + 0.5,
		left: (rect.left + rect.width / 2 - document.body.offsetWidth / 2 + window.scrollX) / window.innerHeight,
	}
}