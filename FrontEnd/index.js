// Je déclare mes variables au début pour pourvoir les réutiliser plus tard(portée) 
let listeProjets = []
let galerieProjet = document.querySelector('.gallery')
let galerieProjetModal = document.querySelector('.modalGallery')
const iconesPoubelle = document.querySelectorAll('.poubelle-icone')

//Je créé ma fonction qui va gérer l'affichage des projets
function afficherProjets(projets) {
    // Je supprime ma galerie HTML
    galerieProjet.innerHTML = ''
    // Je créé chaque projet
    projets.forEach(projet => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        // Je stocke les Id des projets pour pouvoir les réutiliser ultérieurement
        console.log(projet.id)
        figure.setAttribute('data-id', projet.id)

        img.src = projet.imageUrl
        img.alt = projet.title
        figcaption.textContent = projet.title

        figure.appendChild(img)
        figure.appendChild(figcaption)
        galerieProjet.appendChild(figure)
    })
}

// Je créé ma fonction qui va gérer le chargement des projets a partir de l'API
function chargerProjets() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(dataListeProjets => {
            console.table(dataListeProjets)
            // Pour pouvoir utiliser les données à partir de mon fetch
            listeProjets = dataListeProjets
            // Afficher tous les projets une fois qu'ils sont récupérés
            afficherProjets(listeProjets)
            // Afficher également les projets dans ma modale
            afficherProjetsModal(listeProjets)
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données:', error)
        })
}

// Fonction pour filtrer les projets selon leur catégorie
function filtrerProjetsParCategorie(categorieId) {
    const projetsFiltres = listeProjets.filter(projet => projet.categoryId === categorieId)
    // Afficher les projets filtrés par catégorie
    afficherProjets(projetsFiltres)
}

// Fonction qui créé les filtres à partir de de l'API et les rends fonctionnels
function creerFiltres() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(jsonListeFiltres => {
            const filtreProjet = document.querySelector('.filtres')
            filtreProjet.innerHTML = ''

            let filtreTous = document.createElement('button')
            filtreTous.textContent = 'Tous'
            filtreProjet.appendChild(filtreTous)

            // Afficher tous les projets lorsque "Tous" est cliqué
            filtreTous.addEventListener('click', function () {
                afficherProjets(listeProjets)
            });

            jsonListeFiltres.forEach(nomFiltre => {
                const boutonFiltre = document.createElement('button')
                boutonFiltre.textContent = nomFiltre.name
                const categorieId = nomFiltre.id
                console.log(categorieId)
                filtreProjet.appendChild(boutonFiltre)

                // Filtrer par catégorie
                boutonFiltre.addEventListener('click', function () {
                    filtrerProjetsParCategorie(categorieId)
                })
            })
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des filtres :', error)
        })
}

// Appeler les fonctions pour charger les projets et créer les filtres au chargement de la page
chargerProjets()
creerFiltres()
afficherProjetsModal(listeProjets)

//Authentification administrateur
// Je vais chercher mon token stocké dans mon session storage
let token = sessionStorage.getItem('token')
console.log(token)

if (token) {
    let filtresCaches = document.querySelector('.filtres')
    filtresCaches.style.display = 'none'
    let adminElement = document.querySelectorAll('.admin')
    for (let i = 0; i < adminElement.length; i++) {
        adminElement[i].style.display = 'flex'
    }
}
else {
    let adminElement = document.querySelectorAll('.admin')
    for (let i = 0; i < adminElement.length; i++) {
        adminElement[i].style.display = 'none'
    }
}

// Code modale
let modal = null

const ouvrirModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', fermerModal)
    modal.querySelector('.fermerModalJS').addEventListener('click', fermerModal)
    modal.querySelector('.jsModalStop').addEventListener('click', stopPropagation)
}

const fermerModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', fermerModal)
    modal.querySelector('.fermerModalJS').removeEventListener('click', fermerModal)
    modal.querySelector('.jsModalStop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.modalJS').forEach(a => {
    a.addEventListener('click', ouvrirModal)
})

//importer la galerie dans la modale dynamiquement
function afficherProjetsModal(projets) {
    // Je supprime ma galerie HTML
    galerieProjetModal.innerHTML = ''
    // Je créé chaque projet
    projets.forEach(projet => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const editer = document.createElement('p')
        const poubelle = document.createElement('i')
        const move = document.createElement('i')
      
        img.src = projet.imageUrl
        img.alt = projet.title
        editer.textContent = 'éditer'
      
        // Ajout de la classe pour la mise en page dans la modale
        figure.classList.add('modal-figure')
        // Ajout des classes pour l'icône poubelle
        poubelle.classList.add('fa-solid', 'fa-trash-can', 'poubelle-icone')
        // Ajout de la classe pour l'icône déplacer
        move.classList.add('fa-solid', 'fa-up-down-left-right', 'move-icone', 'hidden')
      
        // Récupérer l'ID du projet
        const projetId = projet.id
        console.log(projetId)
      
        // Stocker l'ID du projet comme attribut personnalisé
        figure.setAttribute('data-id', projetId)
      
        galerieProjetModal.appendChild(figure)
        figure.appendChild(img)
        figure.appendChild(editer)
        figure.appendChild(poubelle)
        figure.appendChild(move)
      
        //Gestion de l'apparition de l'icône déplacer
        figure.addEventListener('mouseenter', () => {
          // Afficher l'icône déplacer au survol de l'image
          move.classList.remove('hidden')
        })
        figure.addEventListener('mouseleave', () => {
          // Masquer l'icône déplacer lorsque le curseur quitte l'image
          move.classList.add('hidden')
        })

        //Gestion de la suppression au click sur la poubelle
        poubelle.addEventListener('click',function(event){
            // Empêcher la propagation de l'événement pour éviter de déclencher d'autres écouteurs indésirables
             event.stopPropagation()
            // Appeler la fonction pour supprimer le projet avec l'ID correspondant
             supprimerProjet(projetId)
        })
      })
}

// code suppression API

function supprimerProjet(id) {
    // Vérifier si l'utilisateur est authentifié
  if (!token) {
    alert("Vous devez vous connecter pour supprimer un projet.")
    return
  }
  console.log(token)
  // Vérifier si l'id du projet est présent
  if (!id) {
    alert("Impossible de récupérer l'ID du projet.")
    return
  }
  console.log(id)

  // Effectuer une requête vers l'API pour supprimer le projet
  let url = "http://localhost:5678/api/works/" + id
  const response = fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.ok) {
        // Suppression réussie, faire les traitements nécessaires (par exemple, masquer le projet de l'interface)
        let projet = document.querySelector(`[data-id="${id}"]`)
        console.log(projet)
        alert("Le projet a été supprimé avec succès.")
        chargerProjets()
      } else {
        // La suppression a échoué, afficher un message d'erreur approprié
        console.error("Une erreur s'est produite lors de la suppression du projet:", response.statusText)
        alert("Une erreur s'est produite lors de la suppression du projet.")
      }
    })

    .catch(error => {
      console.error("Une ERREUR s'est produite lors de la suppression du projet:", error.message)
      alert("Une ERREUR s'est produite lors de la suppression du projet.")
    })
}

iconesPoubelle.forEach((poubelle, index) => {
    poubelle.addEventListener('click', (event) => {
      event.stopPropagation()
      const projetId = figureElement.getAttribute('data-id')
      console.log(projetId)
      supprimerProjet(projetId)
    })
  })
  