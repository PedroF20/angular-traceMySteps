# traceMySteps - front-end

A visualization that allows users to understand and analyze their spatio-temporal information, with focus on personal semantics.

AngularJS development of the front-end for traceMySteps. Works with the back-end in python also provided in another repository.

### TODO List: 

<s>1) Bind first four visualizations as proof-of-concept.</s>

2) Change from a faux database/backend to the real backend.

3) Connect the new backend with the frontend.

<s>4) Add more visualizations.</s>

5) Bind all the visualizations.

6) Optimize code, performance & styling - Correct eventual bugs.

7) Perform heuristic and user tests.

8) Deploy the webapp.

9) Write its paper.

### Minor bugs: 

<s>1) Calendar tooltip bug (Gets cropped when shown outside of svg).</s>

<s>2) Calendar resize bug (Not urgent, **calendar is supposed to be of fixed position**).</s>

3) Individual widget pin bug (can't disable the dragging of an individual grid item).

4) Arc Graph is drawn once, but when it is removed and added again to the grid, the arc function
    does not compute edges and nodes.

### Steps to run:

1) Download this folder and the backend repository (on my profile).
2) Open two shell windows (one for each repository).

3) On the Angular project folder:
```
npm start
```

4) On the mock backend folder (will update when changed to the actual backend):
```
python app.py
```
5) Click "Allow" when the pop-up shows.

## Dependencies

For the time being and for development purposes, the dependency files (bower.json and package.json) are not updated. Use the repository-provived dependency folders and follow the steps to run.

When the project is completed the dependency files will be updated.
