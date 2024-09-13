const initialCategory   = "Dessert"
const urlBase           = "https://www.themealdb.com/api/json/v1/1"
const listCategories    = document.getElementById('list-categories');
const results           = document.getElementById('results');
const form              = document.getElementById('form')
const search            = document.getElementById('search')
const selectSorting     = document.getElementById('sorting')
const container         = document.getElementById('container-data')
const spinner           = document.getElementById('spinner')
let option              = 'c'
let mealsArray          = []

listCategories.addEventListener('click', filterByCategories)
form.addEventListener('submit', loadSearchMeals)
selectSorting.addEventListener('change', orderMealsBy)

const loadDataInitial = () => {
    loadCategories()
    loadMeals(initialCategory, option)
    container.classList.remove('d-none')
    spinner.classList.add('d-none')   
}

function loadCategories (){
    fetch(`${urlBase}/categories.php`).then(result => result.json())
        .then(response => {
            displayCategories(response.categories)
        })  
        .catch(error => console.log(error))
}

function displayCategories(categories) {
    listCategories.innerHTML = '';

    categories.forEach(category => {
        const className = initialCategory == category.strCategory ? 'active' : ''
        const card      = `
            <li class="item-nav border my-2 fw-medium py-1 ${className}" data-category="${category.strCategory}">
                <div class="row align-items-center ">
                    <div class="col-4">
                        <div class="image-cat">
                            <img src="${category.strCategoryThumb}" alt="" srcset="" class="w-100 image-categorie">
                        </div>
                    </div>
                    <div class="col-8">
                        <h6 class="m-0">${category.strCategory}</h6>
                    </div>
                </div>
            </li>
        `
        listCategories.insertAdjacentHTML('beforeend', card);
    });
}

function loadSearchMeals(e) {
    e.preventDefault();
    if (search.value == '') {
        option = 'c' 
        loadMeals(initialCategory, option)
        const item = document.querySelector(`.item-nav[data-category="${initialCategory}"]`); 
        if (item) item.classList.add('active')
        return
    }
    option = 's'
    resetUICategories()
    loadMeals(search.value, option)
}

function resetUICategories() {
    const itemsNav = document.querySelectorAll('.item-nav.active')
    itemsNav.forEach(item => item.classList.remove('active'))
}

function filterByCategories(e) {
    const clickedItem   = e.target.closest("li");
    const search        = clickedItem.getAttribute('data-category')

    option = 'c'
    resetUICategories()
    clickedItem.classList.add('active');
    loadMeals(search, option)
}

function loadMeals(search, option) {
    const method = option == 'c' ? 'filter' : 'search'
    fetch(`${urlBase}/${method}.php?${option}=${search}`).then(result => result.json())
        .then(response => {
            mealsArray = response.meals;
            displayResults(response.meals)
        })  
        .catch(error => console.log(error))
}

function displayResults(meals) {
    results.innerHTML = '';

    meals.forEach(meal => {
        const card = `
            <div class="col-md-4 my-3">
                <div class="card item-card" data-id="${meal.idMeal}">
                    <div class="card-body">
                        <div class="image-card mb-2">
                            <img src="${meal.strMealThumb}" alt="" class="w-100 image-result">
                        </div>
                        <div class="card-title m-0">
                            <a href="/details.html?id=${meal.idMeal}" class="text-decoration-none text-white fw-bolder">${meal.strMeal}</a>
                        </div>
                    </div>
                </div>
            </div>
        `
        results.insertAdjacentHTML('beforeend', card)
    })
}

function orderMealsBy(e) {
    const option = e.target.value;
    let newArray = [] 

    if (option == 'id') {
        newArray = mealsArray.toSorted((a, b) => {
            return a.idMeal - b.idMeal;
        });
    } else {
        newArray = mealsArray.toSorted((a, b) => {
            return a.strMeal.localeCompare(b.strMeal);
        });
    }
    displayResults(newArray)
}

window.addEventListener('load', loadDataInitial)