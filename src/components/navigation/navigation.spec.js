const { render, screen, fireEvent } = require("@testing-library/react");
import userEvent from '@testing-library/user-event';
const { default: Navigation } = require("../../components/navigation/navigation");
import { act } from 'react-dom/test-utils';

describe('Navigation Component Rendering Test', () => {
    it('Should render Navbar', () => {
        render(<Navigation />)
        expect(screen.getByText('Inventory')).toBeInTheDocument()
        expect(screen.getByAltText('apple-icon')).toBeInTheDocument()
    })

    it('Should render profile picture', () => {
        render(<Navigation />)
        expect(screen.getByAltText('profile-icon')).toBeInTheDocument()
    })

    it('Should not show profile dropdown before click', () => {
        render(<Navigation />)
        expect(screen.getByAltText('profile-icon-dropdown')).not.toBeVisible()
    })

    it('Should show profile dropdown after click', () => {
        render(<Navigation />)
        const profileDropdown = screen.getByAltText('profile-icon')
        fireEvent.click(profileDropdown)
        expect(screen.getByAltText('profile-icon-dropdown')).toBeVisible()
    })

    it('can select an image and upload', async () => {
        render(<Navigation />)
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
        const imageInput = screen.getByLabelText('choose image');
        await act(async () => {
            userEvent.upload(imageInput, file);
        });
        expect(imageInput.files[0]).toStrictEqual(file);
    })

});