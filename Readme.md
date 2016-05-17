# traceMySteps - front-end

AngularJS development of the front-end for traceMySteps. Works with the back-end in python also provided in another repository.

### TODO List: 

1) Bind first four visualizations as proof-of-concept.

2) Change from a faux database/backend to the real deal.

3) Add more visualizations.

4) Bind all the visualizations.

5) Optimize code & performance; Correct eventual bugs.

6) Style the webapp.

7) Perform heuristic and user tests.

8) Deploy the webapp.

### Minor bugs: 

1) Calendar tooltip bug (Gets cropped when shown outside of svg).

2) Calendar resize bug (Not urgent, calendar is supposed to be of fixed position).

3) Individual widget pin bug (can't disable the dragging of an individual grid item).

### Steps to run:

1) Download this folder and the backend repository (on my profile).
2) Open two terminal windows (one for each repository).

3) On the Angular project folder:
```
npm start
```

4) On the backend folder:
```
python app.py
```
5) Click "Allow" when the pop-up shows.

## Dependencies

For the time being and for development purposes, the dependency files (bower.json and package.json) are not updated. Use the repository provived dependency folders and follow the steps to run.

When the project is completed the dependency files will be updated.
