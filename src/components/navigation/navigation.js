import './navigation.scss';
import AppleIcon from '../../assets/apple.png';
import LocationIcon from '../../assets/location.png'

function Navigation() {

    const fileUpload = () => {
        document.getElementById("file-upload-input").click();
    }

    const changeProfilePic = () => {
        const allProfileImages = document.getElementsByClassName("navbar__profile-pic");
        const selectedFile = window.URL.createObjectURL(document.getElementById('file-upload-input').files[0]);
        if (selectedFile !== null) {
            for (const element of allProfileImages) {
                element.src = selectedFile;
            }
        }
    }

    const toggleProfile = () => {
        const profileEl = document.getElementById('profile-dropdown');
        profileEl.style.display = profileEl.style.display === "none" ? '' : 'none';
    }

    return (
        <nav className="navbar navbar-default">
            {/* Navbar Collapsed */}
            <div className="navbar__content">
                <ul className="navbar__content-list">
                    <li className="navbar__content-list-item navbar__apple">
                        <img src={AppleIcon} className="navbar__apple-icon" alt="apple-icon" />
                        <span className="navbar__apple-icon-name">Inventory</span>
                    </li>
                    <li className="navbar__content-list-item navbar__profile" onClick={toggleProfile}>
                        <img src="https://i.imgur.com/x3omKbe.png" className="navbar__profile-pic" alt="profile-icon" />
                    </li>
                </ul>
            </div>
            {/* Profile Dropdown */}
            <div className="profile">
                <aside className="profile-dropdown" id="profile-dropdown" style={{ display: "none" }}>
                    <div className="navbar__profile-dropdown">
                        <div className="profile-dropdown__avatar">
                            <img src="https://i.imgur.com/x3omKbe.png" className="navbar__profile-pic navbar__profile-dropdown-pic" alt="profile-icon-dropdown" /><span id="uploadfile" onClick={fileUpload}>Edit Avatar</span>
                            <input type="file" id="file-upload-input" aria-label="choose image" name="file-upload-input" onChange={changeProfilePic} />
                        </div>
                        <h4 className='profile-dropdown__title'>Christiano Ronaldo</h4>
                        <div className="flex-container profile-dropdown__location">
                            <img src={LocationIcon} className="profile-dropdown__location-icon" alt="location-icon" /><span className="profile-dropdown__location-icon-title">California, United States</span>
                        </div>
                        <div className="profile-dropdown__role">Senior Call Center Agent</div>
                        <a className="profile-dropdown__email" href="mailto:christiano.ronald@apple.com">christiano.ronald@apple.com</a>
                    </div>
                </aside>
            </div>
        </nav>
    );
}
export default Navigation;