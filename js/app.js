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

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

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

    // Display the calories burned
    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        // Add meal calories to total to get the total meal calories consumed
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
    }

    // Display the calories remaining by subtracting the current total calories from the calorie limit
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
        // Create random id for each meal and make sure that numbers are after the 0
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

// Storage Class
class Storage {
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

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

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

    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

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

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if(meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals));
    }

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

    static saveWorkouts(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if(workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

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

    _loadEventListeners() {
        // Event listener for meal form to add new meal that is created by user to the DOM
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

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

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        Storage.clearAll();
        document.getElementById('filter-workouts').value = '';
    }

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