import "./search.scss";
import React, { useState, useEffect } from 'react';
import FilterIcon from '../../assets/filter.png';
import storedata from '../../data/retaildata.json';
import lineproductdata from '../../data/lineproductdata.json'
import productDetails from '../../data/productdetails.json';
import Accordion from "../accordion/accordion";
import TagItem from "../tagItem/tagItem";
import Table from "../table/table";
import { removeActiveClassFromItems } from '../../Utils';

function Search() {
    const [uniqueCountries, setCountries] = useState([]);
    const [uniqueCities, setCities] = useState([]);
    const [uniqueCategories, setCategories] = useState([]);
    const [allFilters, setFilters] = useState([]);
    const [productData, setData] = useState([]);
    const [filterSet, setTriggerAfterFilterSet] = useState(0);
    const [dataMounted, setTriggerAfterDataUpdates] = useState(0);
    const items = document.querySelectorAll(".search .tagItem");

    useEffect(() => {
        if (storedata !== null) {
            const countries = [...new Set(storedata.map(item => item.country))];
            setCountries(countries);
            const cities = [...new Set(storedata.map(item => item.city))];
            setCities(cities);
        }
        if (lineproductdata !== null) {
            setData(lineproductdata);
            const categories = [...new Set(lineproductdata.map(item => item.category))];
            setCategories(categories);
            setTriggerAfterDataUpdates(dataMounted + 1);
            const autocompleteTerms = [...new Set(lineproductdata.map(item => item.subcategory))];
            const searchbar = document.getElementById('searchbar');
            if (autocompleteTerms.length > 0) autocomplete(searchbar, autocompleteTerms);
        }
        populateFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const autocomplete = (inp, arr) => {
        var currentFocus;
        inp.addEventListener("input", function () {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function () {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });

        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode === 40) { //down
                currentFocus++;
                addActive(x);
            } else if (e.keyCode === 38) { //up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode === 13) { //enter
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        const addActive = (x) => {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActiveClassFromItems(x, "autocomplete-active");
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        const closeAllLists = (elmnt) => {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (const element of x) {
                if (elmnt !== element && elmnt !== inp) {
                    element.parentNode.removeChild(element);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    useEffect(() => {
        handleSearchOnInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterSet, dataMounted])

    useEffect(() => {
        if (allFilters.length > 0) {
            let filteredProducts = lineproductdata.filter(n => allFilters.some(n2 => n.country === n2.country));
            const productsInRegions = filteredProducts.filter(n => allFilters.some(n2 => n.city === n2.city));
            let productsInCategoryInRegion = [];
            if (productsInRegions.length === 0) {
                productsInCategoryInRegion = filteredProducts.filter(n => allFilters.some(n2 => n.category === n2.category))
            } else {
                productsInCategoryInRegion = productsInRegions.filter(n => allFilters.some(n2 => n.category === n2.category))
            }
            setData(productsInCategoryInRegion)
            cleanPageArrows(productsInCategoryInRegion)
            setTriggerAfterFilterSet(filterSet + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFilters]);

    /* Search Method*/ 
    const handleSearchOnInput = () => {
        if (productData.length > 0) {
            const searchbar = document.getElementById('searchbar');
            searchbar.addEventListener('keyup', (e) => {
                const searchString = e.target.value.toLowerCase();
                const processedProductData = reduceProductData(productData);
                const searchData = processedProductData.filter(function (event) {
                    return event.search.indexOf(searchString) > -1
                })
                if (searchData.length > 0) {
                    setData(searchData);
                    cleanPageArrows(searchData);
                }
            });
        }
    }
    /* Filters Methods*/ 
    const populateFilters = () => {
        let collatedfilters = []
        const checkedboxes = document.querySelectorAll('input[type=checkbox]:checked');
        for (const element of checkedboxes) {
            let filterObj = {};
            filterObj[element.parentElement.closest(".accordion-content").parentElement.firstElementChild?.innerText?.toLowerCase()] = element.parentElement.innerText;
            collatedfilters.push(filterObj)
        }
        setFilters(collatedfilters)
    }

    const reduceProductData = (data) => {
        data.forEach((element) => { element.search = element.category + " " + element.store + " " + element.productName + " " + element.city })
        data.forEach((element) => { element.search = element.search.replace(',', '').toLowerCase() })
        return data;
    }
    const toggleFilter = () => {
        const filterEl = document.getElementById('filter-dropdown');
        filterEl.style.display = filterEl.style.display === "none" ? '' : 'none';
    }

    const collateNewFilters = () => {
        populateFilters();
        toggleFilter();
    }

    const manipulateFilters = (e) => {
        let checkedboxes = document.querySelectorAll('input[type=checkbox]:checked');
        for (const element of checkedboxes) {
            if (element.parentElement.innerText === e.target.innerText) {
                element.checked = false;
                element.click();
            }
        }
        populateFilters();
    }

    const cleanPageArrows = (data) => {
        if (data.length <= 10) {
            document.getElementById('nextButton').disabled = true;
        } else {
            document.getElementById('nextButton').disabled = false;
        }
    }

    items.forEach(item => item.addEventListener('click', manipulateFilters));

    return (
        <div className="searchbar">
            <div className="search">
                {/* Searchbar with Autocomplete */}
                <div className="navigation-search">
                    <form autoComplete="off" action="/action_page.php">
                        <div className="autocomplete">
                            <input type="search" placeholder="Search..." className="navigation-search__input" id="searchbar" role="search" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="navigation-search__icon">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </form>
                </div>
                {/* Filter with Filter Dropdown */}
                <div className="filter">
                    <div className="navigation-filter" onClick={toggleFilter} role='button' data-testid="filter">
                        <img src={FilterIcon} alt="Filter Icon" className="filter-icon" /><span>Filters</span>{allFilters.length > 0 ? <div className="filter-count" role="status" data-testid="filter-count">{allFilters.length}</div> : ''}
                    </div>
                    <div className="filter-modal" data-testid="filter-modal" id="filter-dropdown" style={{ display: "none" }}>
                        <div className="filter-modal__saved">
                            <h3>Filters</h3>
                            <span data-testid="saved-filters" id="save-filter" className="filter-modal__saved-filters" onClick={collateNewFilters}>Save view</span>
                        </div>
                        <div className="accordion">
                            <Accordion title="Country" accdata={uniqueCountries} ></Accordion>
                            <Accordion title="City" accdata={uniqueCities} ></Accordion>
                            <Accordion title="Category" accdata={uniqueCategories} ></Accordion>
                        </div>
                    </div>
                </div>
            </div>
            {/* Filter tags iff filters exists */}
            {
                allFilters.length > 0 ?
                    <div className="filtered search" role="list">
                        {allFilters.map((data, index) => {
                            return <TagItem key={index} tag={Object.values(data)} />
                        })}
                    </div> : ''
            }
            {/* Results Table */}
            <Table data={productData} details={productDetails} />
        </div>
    );
}
export default Search;