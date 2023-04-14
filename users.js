fetch("https://randomuser.me/api/?results=10")
    .then((response) => response.json())
    .then((data) => {
        const users = data.results;
        const userList = document.getElementById("user-list");

        users.forEach((user) => {
            const name = `${user.name.first} ${user.name.last}`;
            const email = user.email;
            const birthdate = new Date(user.dob.date).toLocaleDateString();
            const picture = user.picture.medium;

            const userItem = document.createElement("div");
            userItem.classList.add("user");

            const userImage = document.createElement("img");
            userImage.src = picture;

            const userInfo = document.createElement("div");
            userInfo.classList.add("info");

            const userName = document.createElement("div");
            userName.classList.add("name");
            userName.textContent = name;

            const userEmail = document.createElement("div");
            userEmail.classList.add("email");
            userEmail.textContent = email;

            const userBirthdate = document.createElement("div");
            userBirthdate.classList.add("birthdate");
            userBirthdate.textContent = `Né(e) le ${birthdate}`;

            userInfo.appendChild(userName);
            userInfo.appendChild(userEmail);
            userInfo.appendChild(userBirthdate);

            userItem.appendChild(userImage);
            userItem.appendChild(userInfo);

            userList.appendChild(userItem);
        });
    })
    .catch((error) => console.error(error));

let isSortedByName = false;
let isSortedByBirthdate = false;

// Récupérer les boutons de tri
const sortByNameButton = document.getElementById("sort-by-name");
const sortByBirthdateButton =
    document.getElementById("sort-by-birthdate");

// Fonction de tri par nom
function sortByName() {
    const userList = document.getElementById("user-list");
    const users = [...userList.children];
    users.sort((a, b) => {
        const nameA = a.querySelector(".name").textContent;
        const nameB = b.querySelector(".name").textContent;
        return isSortedByName
            ? nameB.localeCompare(nameA)
            : nameA.localeCompare(nameB);
    });
    userList.innerHTML = "";
    users.forEach((user) => {
        userList.appendChild(user);
    });

    // Mettre à jour l'état de tri
    isSortedByName = !isSortedByName;
    isSortedByBirthdate = false;
}

// Fonction de tri par date de naissance
function sortByBirthdate() {
    const userList = document.getElementById("user-list");
    const users = [...userList.children];
    users.sort((a, b) => {
        const birthdateA = new Date(
            a.querySelector(".birthdate").textContent.replace("Né(e) le ", "")
        );
        const birthdateB = new Date(
            b.querySelector(".birthdate").textContent.replace("Né(e) le ", "")
        );
        return isSortedByBirthdate
            ? birthdateB.getTime() - birthdateA.getTime()
            : birthdateA.getTime() - birthdateB.getTime();
    });
    userList.innerHTML = "";
    users.forEach((user) => {
        userList.appendChild(user);
    });

    // Mettre à jour l'état de tri
    isSortedByName = false;
    isSortedByBirthdate = !isSortedByBirthdate;
}

// Ajouter des événements de clic aux boutons de tri
sortByNameButton.addEventListener("click", sortByName);
sortByBirthdateButton.addEventListener("click", sortByBirthdate);

// JavaScript - Recherche
const searchInput = document.getElementById("search");
const userList = document.getElementById("user-list");

searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.trim().toLowerCase();

    for (const user of userList.querySelectorAll(".user")) {
        const userName = user
            .querySelector(".name")
            .textContent.toLowerCase();
        const userEmail = user
            .querySelector(".email")
            .textContent.toLowerCase();
        const userBirthdate = user
            .querySelector(".birthdate")
            .textContent.toLowerCase();

        if (
            userName.includes(searchQuery) ||
            userEmail.includes(searchQuery) ||
            userBirthdate.includes(searchQuery)
        ) {
            user.classList.remove("hidden");
        } else {
            user.classList.add("hidden");
        }
    }
});