# traceMySteps - front-end

A visualization that allows users to understand and analyze their spatio-temporal information, with focus on personal semantics.

AngularJS development of the front-end for traceMySteps. Works with the back-end in python also provided in another repository.

### TODO List: 

<s>1) Bind first four visualizations as proof-of-concept.</s>

<s>2) Change from a faux database/backend to the real backend.</s>

<s>3) Connect the new backend with the frontend.</s>

<s>4) Add more visualizations.</s>

5) Bind all the visualizations & bind with date slider.

6) Optimize code, performance & styling - Correct eventual bugs.

7) Perform heuristic and user tests.

8) Deploy the webapp.

9) Write its paper.

### Minor bugs: 

<s>1) Calendar tooltip bug (Gets cropped when shown outside of svg).</s>

<s>2) Calendar resize bug (Not urgent, **calendar is supposed to be of fixed position**).</s>

3) Individual widget pin bug (can't disable the dragging of an individual grid item).

<s>4) Arc Graph is drawn once, but when it is removed and added again to the grid, the arc function
    does not compute edges and nodes.</s>

5) RootScope Broadcast Leave optimization: the "leave" instruction on a directive may not be listened in the directive itself.
This means a different Leave instruction for each graph, in order to notify all the visualizations depending on it, except the directive itself.

### Steps to run:

1) Download this folder and the backend repository (on my profile).

2) Open two shell windows (one for each repository).

3) For simplification purposes, make sure both back-end and front-end folders are at the same level.

4) On the backend folder (https://github.com/PedroF20/traceMySteps-backend), follow the given instructions.

5) On the Angular project folder:
```
npm start
```

6) Click "Allow" when the pop-up shows.

## Dependencies

For the time being and for development purposes, the dependency files (bower.json and package.json) are not updated. Use the repository-provived dependency folders and follow the steps to run.

When the project is completed the dependency files will be updated.
