# Imperative Angular Cookbook

This is part one of a three-part project series to demonstrate the the differences and advantages of the "Imperative" style of development in Angular compared to the "Declarative" or reactive style. 

If you're a new Angular developer and you've just come of some of the more well-known tutorials out there, this specific type of project might be familiar to you. This is a practical combination of the best practices from the Angular docs and well-known tutorials bundled up into a more or less complete demo. 

## Why build in imperative style when it's not recommended?

A lot of folks learning frontend frameworks tend to get sucked into what style is hot. However, it's not good to follow the next new thing without a practical understanding of the benefits. This happens in Angular too, even if it's not as a hot topic as it was. So, someone still new to Angular might be leaning towards stuff like "don't subscribe, always async pipe" without understanding why. This demo shows at least how the Imperative style can still work properly especially on smaller applications, but can be improved for larger scale with a little more reactivity. 

## What's in this project

- :white_check_mark: Separated Feature Modules with their own child routing modules.
- :white_check_mark: Shared Module implemented for common components, directives, etc. 
- :x: No core module pattern needed due to singleton services and for simplicity in a small app.
- :white_check_mark: Proper use of subscriptions without using async pipes. (Part 2 will have async pipes).
- :white_check_mark: Proper authorization using guards and interceptors.
- :white_check_mark: Firebase REST APIs for Authentication and Realtime Database CRUD to demonstrate `HttpClient` observables.
- :white_check_mark: Tailwind for quick component creation and mobile responsive design. 
- :white_check_mark: Healthy dose of comments in code to help beginners.

## Development server

1. Clone the repo
2. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
3. The login/sign up just uses Firebase auth by email. Enter any email and sufficient password to use the app in full.
4. You can also change the urls from the environments.ts folder to use your own Firebase project.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.3.

