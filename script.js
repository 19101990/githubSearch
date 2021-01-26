const APIURL = "https://api.github.com/users/"

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
    try {
        const res = await axios(APIURL + username)
        updateUI(res.data)
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
        createErrorCard('No user with this username')
        }
    }
}

async function getRepos(username) {
    try {
        const res = await axios(APIURL + username+ '/repos?sort=created')
        addRepos(res.data)
    } catch(err) {
        createErrorCard('Problem fetching repos')
    }
}

// function getUser(username) {
//     axios(APIURL + username)
//         .then(res => console.log(res))
//         .catch(err => console.log(err))
// }

function updateUI(user) {
    const userCard = `
    <div class="card">
        <div>
          <img class="avatar" src="${user.avatar_url}" alt="Avatar of ${user.login}">
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <div><span><a href="${user.blog}" target="_blank">${user.blog}</a></span></div>
          <p>${user.bio}</p>

          <ul>
            <li>${user.followers} <strong>followers</strong></li>
            <li>${user.following} <strong>following</strong></li>
            <li>${user.public_repos} <strong>repos</strong></li>
          </ul>

          <div id="repos" class="repos">
          </div>
        </div>
      </div>
    `
    main.innerHTML = userCard
}

function createErrorCard(message) {
    const errorCard = `
        <div class="card">
            <h2>${message}</h2>
        </div>
    `
    main.innerHTML = errorCard
}

function addRepos(repos) {
    const reposEl = document.getElementById('repos')
    repos.slice(0, 8).forEach(repo => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText = repo.name

        reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const user = search.value
    if(user) {
        getUser(user)
        search.value = ''
    }
})