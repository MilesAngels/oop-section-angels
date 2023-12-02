// Calorie Tracker Class
class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // Public Methods / API
    
    // Add Meal Method
    // - Add new meals to meals array
    // - Add calories gained to the total calories
    // - Call private method render to update UI
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render();
    }

    // Add Workout Method
    // - Add new workout to workouts array
    // - Subtract calories burned to the total calories
    // - Call private method render to update UI
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._render();
    }

    // Private Methods/ API

    // Display the total calories to DOM
    _displayCaloriesTotal() {
        const totalCaloriesEL = document.getElementById('calories-total');
        totalCaloriesEL.innerHTML = this._totalCalories;
    }

    // Display the calorie limit to DOM
    _displayCaloriesLimit() {
        const caloriesLimitEL = document.getElementById('calories-limit');
        caloriesLimitEL.innerHTML = this._calorieLimit;
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

        if(remaining <= 0) {
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

    _render() {
        this._displayCaloriesTotal();
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

// App Class
class App {
    constructor() {
        // Instantiate new calorie tracker class
        this._tracker = new CalorieTracker();

        // Event listener for meal form to add new meal that is created by user to the DOM
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));

        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
    }

    _newMeal(event) {
        event.preventDefault();

        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');

        // Validate input for name and calories
        // - alert user if one or more fields are empty
        if(name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // Create new instance of meal and get name value and calories value (number)
        const meal = new Meal(name.value, +calories.value);
        this._tracker.addMeal(meal);

        // Reset form
        name.value = '';
        calories.value = '';

        // Collapse meal form on submit
        const collapseMeal = document.getElementById('collapse-meal');
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });
    }

    _newWorkout(event) {
        event.preventDefault();

        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');

        // Validate input for name and calories
        // - alert user if one or more fields are empty
        if(name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // Create new instance of meal and get name value and calories value (number)
        const workout = new Workout(name.value, +calories.value);
        this._tracker.addWorkout(workout);

        // Reset form
        name.value = '';
        calories.value = '';

        // Collapse workout form on submit
        const collapseWorkout = document.getElementById('collapse-workout');
        const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
            toggle: true
        });
    
    }
}


class Storage {

}

const app = new App();