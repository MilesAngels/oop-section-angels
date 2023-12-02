class App {

}

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

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
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

class Storage {

}

const tracker = new CalorieTracker();
const breakfast = new Meal('Breakfast', 400);


tracker.addMeal(breakfast);

const run = new Workout('Morning Run', 320);
tracker.addWorkout(run);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories)