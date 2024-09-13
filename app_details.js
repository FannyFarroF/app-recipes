const urlBase = "https://www.themealdb.com/api/json/v1/1"
const detailsContainer = document.getElementById("details-meal")

const loadDataInitial = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('id')) {
        const id = searchParams.get('id');
        loadMealsDetails(id)
    }else
    console.log("ERROR, no tiene el parametro del ID");
}

function loadMealsDetails(id) {
    fetch(`${urlBase}/lookup.php?i=${id}`).then(result => result.json())
        .then(response => {
            displayResult(response.meals[0])
        })  
        .catch(error => console.log(error))
}

function displayResult(meal) {
    console.log(meal);
    const ingredients   = getIngredients(meal)
    // const tags          = meal.strTags ? meal.strTags.split(',') : ''
//     <div class="tags my-2">
//     <span class="">${tags.join(' - ') || ''}</span>
// </div>

    const content = `
        <div class="row justify-content-center align-items-center">
            <div class="basic-data col-md-4">
                <figure class="figure overflow-hidden my-2">
                    <img class="figure-img img-fluid rounded-4" src="${meal.strMealThumb}" alt="">
                </figure>
            </div>
            <div class="col-md-8">
                <h4 class="">${meal.strMeal}
                    <a href="${meal.strYoutube}" title="Link" class="link-external" target="_blank">
                        <i class="fas fa-link"></i>
                    </a>
                </h4>
                <ul class="badges list-unstyled d-flex">
                    <li class="px-3 py-2 item-badge">Category: ${meal.strArea}</li>
                    <li class="px-3 py-2 item-badge mx-2">Area: ${meal.strCategory}</li>
                </ul>
            </div>
        </div>
        <div class="row my-4">
            <div class="col-md-4">
                <h5><i class="icon-title fas fa-angle-right me-2"></i> Ingredients</h5>
                <ul class="mt-3 ingredients">
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="col-md-8">
                <h5><i class="icon-title fas fa-angle-right me-2"></i> Instructions</h5>
                <p class="mt-3 fw-light"> ${meal.strInstructions} </p>
            </div>   
        </div>   
    `

    detailsContainer.insertAdjacentHTML('beforeend', content)
}

function getIngredients(meal) {
    const ingredients       = []
    const keys              = Object.keys(meal) 
    const ingredientsKeys   = keys.filter( key => key.includes('strIngredient') ) 

    ingredientsKeys.forEach((ingredient, index) => {
        const ingredientValue = meal[ingredient]
        const measureValue     = meal[`strMeasure${index+1}`]

        if (ingredientValue == '' || ingredientValue == null) return
        const strIngredient = `${measureValue} ${ingredientValue}`
        ingredients.push(strIngredient)
    })
    return ingredients;
}

window.addEventListener('load', loadDataInitial)