# @stratify/stratify-ui

## 0.1.5

### Patch Changes

- cc6b2af: - Build login page
    - Move submit handler for the sign up form to a separate file to allow for unit tests to be written for it
    - Add unit tests for login page, login form and submit handler
    - Add unit tests for the submit handler used in the sign up form
    - Rename unauthenticated route group (for public-facing pages) to "public"

## 0.1.4

### Patch Changes

- 8cb02cf: - Add route group for authentication pages (auth)
    - Move landing page to a route group for pages that don't require a user to be signed in (unauthenticated)
    - Build form for sign up page
    - Use better auth client to make it fully functional
    - Add unit tests for the sign up page
    - Build reusable components that can be used in forms

## 0.1.3

### Patch Changes

- acea05b: ## Additions
    - Build landing page
    - Build navigation bar
        - Includes Brand text and logo
        - Includes Sign up and login buttons
    - Add unit tests for landing page and navigation bar
    - Update configuration for Tailwind CSS to allow for accessing colours properly from globals.css

    ## Fixes
    - Fix "/api" not being removed from URL after being processed by the middleware

## 0.1.2

### Patch Changes

- 8ca64c4: - Add hook for creating an instance for handling authentication with Better Auth
    - Add middleware layer for proxying requests to the correct APIs based on the path name in the request URL
    - Add environment provider so that the proxy URLs for accessing APIs are accessible by a client

## 0.1.1

### Patch Changes

- 85c2478: Setup nextjs and add tailwind css config
