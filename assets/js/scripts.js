var myInput = document.querySelector("#myInput"),
  myDiv = document.querySelector("#myDiv"),
  apiUrl = "https://api.github.com/search/repositories?q=",
  inputs = Rx.Observable.fromEvent(myInput, "keyup"),
  projectsList = new Rx.BehaviorSubject([]);

inputs
  .debounce(() => Rx.Observable.interval(500))
  .map((event) => event.target.value)
  .filter((text) => text.length > 2)
  .subscribe(searchProjects);

function searchProjects(projectName) {
  Rx.Observable.fromPromise(fetch(`${apiUrl}${projectName}`)).subscribe(
    (response) => {
      response
        .json()
        .then((result) => result.items)
        .then((itemsList) => {
          projectsList.next(itemsList);
        });
    }
  );
}

projectsList.subscribe((projects) => {
  var template = "";
  projects.forEach((project) => {
    template += `
    <div class="col-sm-3">
        <div class="card" style="width: 100%">
        <img src="${project.owner.avatar_url}" class="card-img-top img-thumbnail w-100 img-fluid"  alt="${project.name}">
        <div class="card-body">
          <h5 class="card-title">${project.owner.login}</h5>
          <p class="card-text">${project.name}</a>
        </div>
      </div>
	  </div >
		`;
  });
  myDiv.innerHTML = `<div class="card-deck">${template}</div>`;
});
