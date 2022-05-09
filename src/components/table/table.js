import './table.scss';
import React, { useEffect, useState } from 'react';
import Modal from '../modal/modal';

function Table(props) {
    const [paginationInput, setInput] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [productDetails, setProductDetails] = useState({});

    const pageSize = 10;
    let curPage = 1;

    const goPrev = () => {
        if (curPage > 1) {
            curPage--;
            document.getElementById("pagination-page").value = curPage;
        }
        cleanUpPagination(curPage)
        renderTable();
    }

    const goNext = () => {
        if ((curPage * pageSize) < props.data.length) {
            curPage++;
            document.getElementById("pagination-page").value = curPage;
        }
        cleanUpPagination(curPage);
        renderTable();
    }

    const changePageNumber = () => {
        setInput(document.getElementById("pagination-page").value);
    }

    useEffect(() => {
        curPage = paginationInput;
        cleanUpPagination(paginationInput);
        renderTable(paginationInput);
    }, [paginationInput])

    const cleanUpPagination = (currPage) => {
        if (currPage == 1) document.getElementById("prevButton").disabled = true;
        if (currPage > 1) document.getElementById("prevButton").disabled = false;
        if (props.data.length > 0) {
            const curPageItems = (props.data.slice(((currPage - 1) * pageSize), (currPage * pageSize)))
            const isLastPage = curPageItems.length < pageSize;
            if (isLastPage) {
                document.getElementById("nextButton").disabled = true
            } else {
                document.getElementById("nextButton").disabled = false
            }
        }
    }

    useEffect(() => {
        if (curPage === 1) document.getElementById("prevButton").disabled = true;
        const buttonClose = document.getElementsByClassName('modalClose')[0];
        buttonClose.addEventListener('click', modalClose);
    }, [])


    const modalClose = () => {
        const modal = document.getElementById('productModal');
        modal.classList.remove('effect');
        setShowModal(false)
    };

    const rowClickHandler = function (row) {
        return function () {
            var cell = row.getElementsByTagName("td")[0];
            let newproductDetails = {}
            newproductDetails.name = cell.firstChild.innerHTML;
            newproductDetails.imgUrl = cell.getElementsByTagName('img')[0].src;
            const selectedDetail = props.details.find(item => item.name.replace('-inch', '').toLowerCase() === newproductDetails.name.replace(/['"]+/g, '').toLowerCase());
            newproductDetails.productSpecs = selectedDetail.productSpecs;
            newproductDetails.colors = selectedDetail.colors;
            setProductDetails(newproductDetails)
            setShowModal(true)
        };
    };

    const renderTable = (specifiedPage = curPage) => {
        const table = document.querySelector('#table-results tbody');
        let result = '';
        props.data.filter((_row, index) => {
            let start = (specifiedPage - 1) * pageSize;
            let end = specifiedPage * pageSize;
            if (index >= start && index < end) return true;
        }).forEach((item, index) => {
            const productColors = [...new Set(item.variants.map(variant => variant.color))];
            const productTypes = [...new Set(item.variants.map(variant => variant.type))];
            result += `<tr id="${item.productName.replaceAll(' ', '').toLowerCase()}${index}">
                <td><div>${item.productName}</div><img src=${item.imgURL} alt=${item.productName} class="productImg"></img></td>
                <td>${item.category}</td>
                <td><div>${item.store}</div><div class="city-display">${item.city}</div></td>
                <td><div class="variants-display">${renderVariantColumn(productColors, productTypes, item.variants)}</div>
                </td>
            </tr>`
        });
        if (table !== null) {
            table.innerHTML = result;
            const tablerows = document.querySelectorAll('#table-results tbody tr');
            if (tablerows.length > 0) {
                for (const element of tablerows) {
                    const currentRow = element;
                    currentRow.onclick = rowClickHandler(currentRow);
                }
            }
        }
    }

    const renderVariantColumn = (productColors, productTypes, variants) => {
        let variantResult = '';
        const alteredProductColors = productColors.map(element => {
            return element.toLowerCase().replace(/\s+/g, '');
        })
        alteredProductColors.map((product, index) => {
            const currentColor = productColors[index];
            variantResult += `<div class="variants-display__column" key="column-${index}"}>
                <div class="swatch-container">
                <div key=${index} class="variants-display__color-swatch ${product.replace('(', '').replace(')', '')}"} title=${currentColor}></div>
                ${renderProductType(productTypes, variants, currentColor)}
            </div>
            </div>`
        })
        return variantResult;
    }

    const renderProductType = (productTypes, variants, currentColor) => {
        let productResult = '';
        productTypes.map((type, index) => {
            const currentType = type;
            const currProduct = variants.find(function (el) {
                return el.color === currentColor && el.type === currentType
            });
            if (currProduct !== undefined) {
                const shortenedType = currentType.replace('Memory', '/').replace('SSD', '')
                productResult += `<div key="type-${index}" class="variants-display__type ${currProduct.available ? 'available' : 'unavailable'}" title=${currentType}><span class="hide-on-hover">${shortenedType}</span><span class="show-on-hover">$${currProduct.price}</span></div>`
            }
        })
        return productResult;
    }

    return (
        <div className="table-item">
            <div className="table-item__items"><span id="total-count" role="log">{props.data.length} items</span></div>
            <div className='table-container'>
                <table className="table table-hover table-bordered results" id="table-results">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Store Location</th>
                            <th>Variants Availability</th>
                        </tr>
                        <tr className="warning no-result">
                            <td colSpan="4"><i className="fa fa-warning"></i> No result</td>
                        </tr>
                    </thead>
                    <tbody title="product-table">
                        {
                            renderTable()
                        }
                    </tbody>
                </table>
            </div>
            <div className="table-pagination">
                <button id="prevButton" onClick={goPrev} title="prev-button">Previous</button>
                <span><input title="current-page" className="pagination-pf-page" type="text" id="pagination-page" onChange={() => changePageNumber()} value={paginationInput} />
                    <span id="totalPages" className="as-pagination-totalnumbers">of {Math.max(Math.ceil(props.data.length / pageSize), 1)} Page(s)</span></span>
                <button id="nextButton" onClick={goNext} title="next-button">Next</button>
            </div>
            <Modal open={showModal} info={productDetails}></Modal>
        </div>
    );
}
export default Table;