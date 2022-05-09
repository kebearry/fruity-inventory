const { render, screen, fireEvent } = require("@testing-library/react");
const { default: Table } = require("./table");
import lineproductdata from '../../data/lineproductdata.json'
import productDetails from '../../data/productdetails.json';
import shortproductdata from '../../data/shortproductdata.json';

describe('Table Component Rendering Test', () => {
    it('Should render total item count', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        expect(screen.getByRole('log')).toHaveTextContent(lineproductdata.length);
    })

    it('Should render less than or equal to 10 rows', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        expect(screen.getByTitle("product-table").childElementCount).toBeLessThanOrEqual(10);
    })

    it('Should be able to click next page button when items > 10', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        expect(screen.getByTitle("next-button")).not.toHaveAttribute("disabled");
    })

    it('Should not be able to click next page button when items < 10', () => {
        render(<Table data={shortproductdata} details={productDetails} />)
        expect(screen.getByTitle("next-button")).toHaveAttribute("disabled");
    })

    it('Should not be able to click prev page button when page number is at 1', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        expect(screen.getByTitle("prev-button")).toHaveAttribute("disabled");
    })

    it('Should be at next page when next arrow is clicked', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        fireEvent.click(screen.getByTitle("next-button"))
        expect(parseInt(screen.getByTitle("current-page").value)).toBeGreaterThan(1);
    })

    it('Should render product details modal when a product row is clicked', () => {
        render(<Table data={lineproductdata} details={productDetails} />)
        fireEvent.click(screen.getByTitle("product-table").firstChild)
        expect(screen.getByTitle("product-details")).toHaveStyle('visibility: visible');
    })
})