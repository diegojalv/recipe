const apiKey = '8050708f94b040688534233dca3f83e6';

// Call fetchRecipes when the search form is submitted
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value;
    fetchRecipes(searchInput);
});


function fetchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=10`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => displayRecipes(data.results))
        .catch(error => console.log('Error fetching recipes:', error));
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';

    for (let i = 0; i < recipes.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('row', 'mb-4');

        for (let j = i; j < Math.min(i + 4, recipes.length); j++) {
            const recipe = recipes[j];
            const card = `
                <div class="col-md-3">
                    <div class="card">
                        <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.title}</h5>
                            <a href="#" class="btn btn-primary view-recipe-btn" data-recipe-id="${recipe.id}">View Recipe</a>
                            <button class="btn btn-info rate-recipe-btn" data-recipe-id="${recipe.id}">Rate</button>
                            <input class="ratingInput" type="number" min="1" max="5" placeholder="Enter your rating (1-5)">
                            <p class="card-text">Rating: <span id="rating-${recipe.id}" class="rating-${recipe.id}" data-total="0">0</span> (Average: <span id="average-rating-${recipe.id}" class="average-rating-${recipe.id}">0</span>)</p>
                        </div>
                    </div>
                </div>
            `;
            row.innerHTML += card;
        }

        recipesContainer.appendChild(row);
    }
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('rate-recipe-btn')) {
            event.stopPropagation(); // Prevent modal from showing when rating button is clicked
            const recipeId = event.target.getAttribute('data-recipe-id');
            const ratingInput = event.target.parentElement.querySelector('.ratingInput');
            const rating = parseFloat(ratingInput.value);
            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                // Update the displayed rating
                const currentRatingSpan = document.getElementById(`rating-${recipeId}`);
                const currentRating = parseFloat(currentRatingSpan.textContent);
                const totalRatings = parseFloat(currentRatingSpan.dataset.total) || 0;
                const newTotalRatings = totalRatings + 1;
                const newRating = (currentRating * totalRatings + rating) / newTotalRatings;
                currentRatingSpan.textContent = newRating.toFixed(1);
                currentRatingSpan.dataset.total = newTotalRatings;

                // Calculate and display average rating
                const averageRatingSpan = document.getElementById(`average-rating-${recipeId}`);
                const averageRating = parseFloat(averageRatingSpan.textContent);
                const newAverageRating = (averageRating * (newTotalRatings - 1) + rating) / newTotalRatings;
                averageRatingSpan.textContent = newAverageRating.toFixed(1);
            } else {
                alert('Please enter a valid rating (1-5)!');
            }
        }
    });



    // Add event listener to each "View Recipe" button
    const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recipeId = button.getAttribute('data-recipe-id');
            showRecipeDetails(recipeId);
        });
    });
}

function showRecipeDetails(recipeId) {
    // Remove existing modal
    $('#recipeModal').remove();

    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display recipe details dynamically on the webpage
            const recipeDetails = `
                <div class="modal fade" id="recipeModal-${recipeId}" tabindex="-1" role="dialog" aria-labelledby="recipeModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="recipeModalLabel">${data.title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <img src="${data.image}" class="img-fluid mb-3" alt="${data.title}">
                                <p>${data.summary}</p>
                                <p>Preparation Time: ${data.readyInMinutes} minutes</p>
                                <p>Rating: ${data.spoonacularScore}</p>
                                <h6>Ingredients:</h6>
                                <ul>
                                    ${data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                                </ul>
                                <h6>Instructions:</h6>
                                <p>${data.instructions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', recipeDetails);
            $(`#recipeModal-${recipeId}`).modal('show');
        })
        .catch(error => console.log('Error fetching recipe details:', error));
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value;
    fetchRecipes(searchInput);

    const rateRecipeButtons = document.querySelectorAll('.rate-recipe-btn');
});