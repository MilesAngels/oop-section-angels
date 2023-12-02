// Calorie Tracker Class
class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    // Public Methods / API

    // Add Meal Method
    // - Add new meals to meals array
    // - Add calories gained to the total calories
    // - Call private method render to update UI
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    // Add Workout Method
    // - Add new workout to workouts array
    // - Subtract calories burned to the total calories
    // - Call private method render to update UI
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkouts(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    // Remove meal from DOM
    // - Look for specific id of meal and check if the id being passed is the same as the meal id
    // - Check if the meal we are looking for is in storage
    // - Subtract meal calories from total calories and update the total calories from local storage
    // - Remove the meal from the DOM and local storage
    // - Reload DOM
    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            Storage.removeMeal(id);
            this._render();
        }
    }

    // Remove workout from DOM
    // - Look for specific id of workout and check if the id being passed is the same as the workout id
    // - Check if the workout we are looking for is in storage
    // - Subtract workout calories from total calories and update the total calories from local storage
    // - Remove the workout from the DOM and local storage
    // - Reload DOM 
    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    // Reset items
    // - Reset values of total calories, meals, snd workouts
    // - Reload DOM
    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    // Set the calorie limit
    // - Save the calorie limit being passed to local storage
    // - Reload DOM
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    // Load items into the DOM
    loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout));
    }


    // Private Methods/ API

    // Display the total calories to DOM
    _displayCaloriesTotal() {
        const totalCaloriesEL = document.getElementById('calories-total');
        totalCaloriesEL.innerHTML = this._totalCalories;
    }

    // Display the calorie limit to DOM
    _displayCaloriesLimit() {
        const calorieLimitEL = document.getElementById('calories-limit');
        calorieLimitEL.innerHTML = this._calorieLimit;
    }

    // Display the calories consumed
    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        // Add meal calories to total to get the total meal calories consumed
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);

        caloriesConsumedEl.innerHTML = consumed;
    }

    // Display the calories burned and ser it to 0 if there are no workout calories
    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        // Add meal calories to total to get the total meal calories consumed
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
    }

    // Display the calories remaining via progress bar and element
    // - Subtract the current total calories from the calorie limit
    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }
        else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
        }
    }

    // Display the calorie progress by updating the progress bar
    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        progressEl.style.width = `${width}%`;
    }

    // Display newly added meal in DOM and append it's child element to the parent element
    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

        mealsEl.appendChild(mealEl);
    }

    // Display the newly added workout to the DOM and append it's child element to the parent element
    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

        workoutsEl.appendChild(workoutEl);
    }

    // Reload DOM to update values
    _render() {
        
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

}

// Meal Class
class Meal {
    constructor(name, calories) {
        // Create random id for each meal and make sure that numbers are after the 0
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

class Workout {
    constructor(name, calories) {
        // Create random id for each workout and make sure that numbers are after the 0
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

// Storage Class
class Storage {
    // Get the calorie limit from the local storage
    // - If the user does not specify calorie limit, default value will be used
    // - If the user specifies the calorie limit then add the value to local storage
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if(localStorage.getItem('calorieLimit') == null) {
            calorieLimit = defaultLimit;
        }
        else{
            calorieLimit = +localStorage.getItem('calorieLimit');
        }

        return calorieLimit;
    }

    // Set the calorie limit in local storage
    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    // Get the total calories from local storage
    // - If there is no value for totalCalories, then set it to the default value
    // - Else, set the value of totalCalories to the value from local storage
    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if(localStorage.getItem('totalCalories') == null) {
            totalCalories = defaultCalories;
        }
        else{
            totalCalories = +localStorage.getItem('totalCalories');
        }

        return totalCalories;
    }

    // Update total calories in local storage
    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    // Get meals from local storage
    // - If there are no meals in local storage then set the meals to an empty array
    // - Else, parse and get the meals from local storage
    static getMeals() {
        let meals;
        if(localStorage.getItem('meals') == null) {
            meals = [];
        }
        else{
            meals = JSON.parse(localStorage.getItem('meals'));
        }

        return meals;
    }

    // Save the meal to local storage as strings
    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // Remove the meal from local storage by checking it's id
    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if(meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // Get the workout from local storage
    // - If there are no workouts in local storage then set the workouts to an empty array
    // - Else, parse and get the workouts from local storage
    static getWorkouts() {
        let workouts;
        if(localStorage.getItem('workouts') == null) {
            workouts = [];
        }
        else{
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }

        return workouts;
    }

    // Save workout to local storage as string
    static saveWorkouts(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    // Remove the workout from local storage by checking it's id
    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if(workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    // Clear total calories, meals, and workouts from local storage
    static clearAll() {
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');

        //localStorage.clear();
    }
    
}

// App Class
class App {
    constructor() {
        // Instantiate new calorie tracker class
        this._tracker = new CalorieTracker();

        this._loadEventListeners();
        
        this._tracker.loadItems();
    }

    // Load all event listeners
    _loadEventListeners() {
    
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    // Create and Add new workout or meal to DOM
    _newItem(type, event) {
        event.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validate input for name and calories
        // - alert user if one or more fields are empty
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        if (type === 'meal') {
            // Create new instance of meal and get name value and calories value (number)
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }
        else {
            // Create new instance of workout and get name value and calories value (number)
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }


        // Clear form
        name.value = '';
        calories.value = '';

        // Collapse workout form on submit
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true
        });

    }

    // Remove item from DOM
    _removeItem(type, event) {
        if (event.target.classList.contains('delete') || event.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure you want to delete this item?')) {
                const id = event.target.closest('.card').getAttribute('data-id');

                type === 'meal'
                    ? this._tracker.removeMeal(id)
                    : this._tracker.removeWorkout(id);

                event.target.closest('.card').remove();
            }
        }
    }

    // Filter items
    _filterItems(type, event) {
        const text = event.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            }
            else {
                item.style.display = 'none';
            }
        });
    }

    // Reset all items in the app
    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        Storage.clearAll();
        document.getElementById('filter-workouts').value = '';
    }

    // Set the calorie limit
    _setLimit(event) {
        event.preventDefault();
        const limit = document.getElementById('limit');
        if(limit.value === '') {
            alert('Please add a limit.');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';


        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

    }

}


const app = new App();