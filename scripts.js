document.addEventListener("DOMContentLoaded", function () {
    const addRecipeForm = document.getElementById("addRecipeForm");
    const recipeList = document.getElementById("recipeList");
    let recipeCards = []; // Array to hold recipe card elements

    // Sample data for initial recipes
    const initialRecipes = [
        { name: "Chocolate Chip Cookies", ingredients: "Flour, sugar, chocolate chips, butter, eggs", instructions: "1. Preheat oven...", ratings: [4, 5, 3] },
        { name: "Pasta Carbonara", ingredients: "Pasta, eggs, bacon, Parmesan cheese, black pepper", instructions: "1. Cook pasta...", ratings: [5, 4, 5, 3] },
        { name: "Chicken Stir-Fry", ingredients: "Chicken breast, vegetables, soy sauce, garlic, ginger", instructions: "1. Heat oil in a pan...", ratings: [3, 4, 2, 4, 5] }
    ];

    // Function to calculate average rating
    function calculateAverageRating(ratings) {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((total, rating) => total + rating, 0);
        return sum / ratings.length;
    }

    // Function to generate star icons HTML based on the average rating
    function generateStarsHTML(averageRating) {
        const roundedRating = Math.round(averageRating * 2) / 2; // Round to nearest 0.5
        const starCount = Math.floor(roundedRating);
        const hasHalfStar = roundedRating % 1 !== 0;

        let starsHTML = '';
        for (let i = 0; i < starCount; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const remainingStars = 5 - starCount - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    // Function to create recipe card
    function createRecipeCard(recipe) {
        const averageRating = calculateAverageRating(recipe.ratings);
        const starsHTML = generateStarsHTML(averageRating);

        const recipeCard = document.createElement("div");
        recipeCard.className = "col-md-4 recipe-card";
        recipeCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <p class="card-text">Ingredients: ${recipe.ingredients}</p>
                    <p class="card-text">Instructions: ${recipe.instructions}</p>
                    <div class="rating">
                        ${starsHTML}
                        <span class="average-rating">${averageRating.toFixed(1)}</span>
                    </div>
                    <button class="btn btn-primary rate-btn">Rate Recipe</button>
                </div>
            </div>
        `;
        return recipeCard;
    }

    // Function to render recipe cards
    function renderRecipeCards() {
        recipeList.innerHTML = ""; // Clear previous cards
        recipeCards.forEach(card => {
            recipeList.appendChild(card);
        });
    }

    // Populate initial recipes and recipe cards
    initialRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipeCards.push(recipeCard);
    });

    // Render initial recipe cards
    renderRecipeCards();

    // Event listener for form submission
    addRecipeForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get values from the form inputs
        const recipeName = document.getElementById("recipeName").value.trim();
        const recipeIngredients = document.getElementById("recipeIngredients").value.trim();
        const recipeInstructions = document.getElementById("recipeInstructions").value.trim();

        if (recipeName !== "" && recipeIngredients !== "" && recipeInstructions !== "") {
            // Create a new recipe object
            const newRecipe = {
                name: recipeName,
                ingredients: recipeIngredients,
                instructions: recipeInstructions,
                ratings: [] // Initialize ratings array for new recipe
            };

            // Create recipe card for the new recipe
            const newRecipeCard = createRecipeCard(newRecipe);
            recipeCards.push(newRecipeCard);

            // Sort recipe cards based on average rating (highest to lowest)
            recipeCards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector(".average-rating").textContent);
                const ratingB = parseFloat(b.querySelector(".average-rating").textContent);
                return ratingB - ratingA;
            });

            // Render recipe cards
            renderRecipeCards();

            // Clear the form inputs
            addRecipeForm.reset();
        } else {
            alert("Please fill in all fields");
        }
    });

    // Event listener for "Rate Recipe" buttons
    recipeList.addEventListener("click", function (event) {
        if (event.target.classList.contains("rate-btn")) {
            const recipeName = event.target.closest(".card-body").querySelector(".card-title").textContent;
            const rating = prompt(`Rate "${recipeName}" (1-5):`);
            if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
                const recipeCard = event.target.closest(".recipe-card");
                const ratingsContainer = recipeCard.querySelector(".rating");
                const averageRatingElement = recipeCard.querySelector(".average-rating");
                const currentRatings = JSON.parse(recipeCard.getAttribute("data-ratings")) || [];
                const newRatings = [...currentRatings, parseInt(rating)];
                const newAverageRating = calculateAverageRating(newRatings);
                const starsHTML = generateStarsHTML(newAverageRating);
                ratingsContainer.innerHTML = starsHTML + `<span class="average-rating">${newAverageRating.toFixed(1)}</span>`;
                recipeCard.setAttribute("data-ratings", JSON.stringify(newRatings));

                // Update the recipe card in the array
                recipeCards.forEach(card => {
                    if (card === recipeCard) {
                        card = createRecipeCard({
                            name: recipeCard.querySelector(".card-title").textContent,
                            ingredients: recipeCard.querySelector(".card-text:nth-child(2)").textContent.slice(12),
                            instructions: recipeCard.querySelector(".card-text:nth-child(3)").textContent.slice(14),
                            ratings: newRatings
                        });
                    }
                });

                // Sort recipe cards based on average rating (highest to lowest)
                recipeCards.sort((a, b) => {
                    const ratingA = parseFloat(a.querySelector(".average-rating").textContent);
                    const ratingB = parseFloat(b.querySelector(".average-rating").textContent);
                    return ratingB - ratingA;
                });

                // Render recipe cards
                renderRecipeCards();
            } else {
                alert("Invalid rating. Please enter a number between 1 and 5.");
            }
        }
    });
});
