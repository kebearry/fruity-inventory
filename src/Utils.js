export const removeActiveClassFromItems = (elToRemove, activeClass) => {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (const element of elToRemove) {
        element.classList.remove(activeClass);
    }
}