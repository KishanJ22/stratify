---
"@stratify/stratify-ui": minor
---

- Build goal progression card and modal to set a goal
- If the user has not set a goal, then the user is informed that no goal has been set and is allowed to set a goal by clicking the "Set" button, which opens a modal to set a goal
- If the user has already set a goal, then the user is shown the current goal and can edit the goal by clicking the "Edit" button, which opens a modal to edit the goal, identical to what is done above
- If the total value of all of the user's portfolios is greater than the target goal amount, then the user is shown a green progress bar and text telling them that they have reached their goal and the target amount
- Add unit tests for goal progression card, set goal modal and api hooks