const { render, screen, fireEvent } = require("@testing-library/react");
const { default: Accordion } = require("../accordion/accordion")

describe('Accordion Component Rendering Test', () => {
    it('Check that the first accordion is opened', () => {
        const testData = ["Flipflops", "Sandal", " Sneakers"];
        render(<Accordion title="Footwear" accdata={testData} />);
        expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    })
})