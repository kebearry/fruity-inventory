const { render, screen, fireEvent } = require("@testing-library/react");
const { default: Search } = require("../../components/search/search");

describe('Search Component Rendering Test', () => {
    it('Should render search component', () => {
        render(<Search />)
        expect(screen.getByRole('search')).toBeInTheDocument()
    })
    it('Searchbar shoud receive input', () => {
        render(<Search />)
        const searchTerm = 'iPhone 13'
        const searchBar = screen.getByRole('search')
        fireEvent.change(searchBar, { target: { value: searchTerm } })
        expect(searchBar.value).toEqual(searchTerm)
    })
    it('Should not render Filter Modal before Filter Button is Clicked', () => {
        render(<Search />)
        const filterModal = screen.getByTestId('filter-modal');
        expect(filterModal).not.toBeVisible();
    })
    it('Should render Filter Modal after Filter Button is Clicked', () => {
        render(<Search />)
        const filterButton = screen.getByTestId('filter');
        fireEvent.click(filterButton)
        const filterModal = screen.getByTestId('filter-modal');
        expect(filterModal).toBeVisible();
    })
    it('Should not render Filter Count before Filter Checkboxes are Clicked and Saved', async () => {
        render(<Search />)
        const filterCount = screen.queryByRole('status');
        expect(filterCount).toBeNull();
    })
    it('Should render Filter Count if Filter Checkboxes are Clicked and Saved', async () => {
        render(<Search />)
        fireEvent.click(screen.getByTestId('saved-filters'));
        const filterCount = screen.getByRole('status');
        expect(filterCount).toBeVisible();
    })
    it('Should render Filter Tags after Filter Checkboxes are Clicked and Saved', () => {
        render(<Search />)
        const filterList = screen.getByRole('list');
        expect(filterList).toBeVisible();
    })
});