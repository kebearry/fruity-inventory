import './modal.scss';

function Modal(props) {

    return (
        <div id="productModal" title="product-details" className={`modal ${props.open ? 'effect' : ''}`}>
            <span className="modalClose" id="modal-close"></span>
            <div className="modal-content">
                <div className="modal-content__product-display">
                    <img src={props.info?.imgUrl} alt={props.info?.name} />
                    <div>Available in {props.info?.colors?.length} colours</div>
                    <div className="swatch-container">
                        {props.info?.colors?.map((color, index) => {
                            return <div key={index} className={`swatch-container__swatch ${color.toLowerCase().replace(' ', '').replace('(', "").replace(')', "")}`}></div>
                        })}
                    </div>
                </div>
                <div className='modal-content__specs-display'>
                    <h2>{props.info?.name}</h2>
                    <ul className="square-bullets">
                        {props.info?.productSpecs?.map((data, index) => {
                            return <li key={index}>{data}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Modal;