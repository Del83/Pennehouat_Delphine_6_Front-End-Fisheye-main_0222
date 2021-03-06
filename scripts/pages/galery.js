/** ---------- FETCH DATA pour récupérer les infos média du fichier JSON ---------- */
const getMedias = async () => {
  await fetch("./data/photographers.json")
    .then((res) => res.json())
    .then((data) => (medias = data.media));

  return {
    medias: [...medias],
  };
};

/** ---------- Récupération et transformation en nombre de l'ID de la page photographe.html ---------- */
function getPhotographerId() {
  return parseInt(new URLSearchParams(window.location.search).get("id"));
}

/** ---------- Affichage de la galerie des médias du photographe ---------- */
function photographGaleryDisplay() {
  const mediasFilter = medias.filter(
    (media) => media.photographerId === parseInt(getPhotographerId())
  ); /** Filtre les médias en comparant l'ID du photographe et l'ID de la page (dans l'adresse HTML) */

  const itemsSort = document.querySelector(
    ".listbox-custom-new"
  ).textContent; /** Cible le texte du bouton de tri */

  /** ---------- Selectionne la fonction à utiliser selon la catégorie qui s'affiche  ---------- */
  function selectSort(itemSort) {
    if (itemSort === "Date") {
      /** Si le texte du bouton est égale à "Date" */
      return sortMediaByDate; /** Retourne le tri par dates */
    } else if (itemSort === "Popularité") {
      /** Sinon si le texte du bouton est égale à "Popularité" */
      return sortMediaByLikes; /** Retourne le tri par likes */
    } else {
      return sortMediaByTitle; /** Sinon retourne le tri par titres */
    }
  }

  /** ---------- Medias filtrés et triés  ---------- */
  mediasFilter.sort(
    selectSort(itemsSort)
  ); /** TRI dans les médias filtrés selon la selection de tri */

  const photographGalery = document.querySelector(".photograph-galery");
  const photographLightbox = document.getElementById("lightbox-container");

  photographGalery.innerHTML = ""; /** Vide le DOM de la galerie */
  photographLightbox.innerHTML = ""; /** Vide le DOM du carousel */

  mediasFilter.forEach((media) => {
    if (mediasFilter.indexOf()) {
      const photographerModelGalery =
        galeryFactory(
          media
        ); /** Récupération des données des médias du photographe ciblé */
      const userGalery =
        photographerModelGalery.getUserGaleryDOM(); /** Création de la carte du média dans la galerie du photographe */
      photographGalery.appendChild(
        userGalery
      ); /** On rattache cet élément dans le DOM */

      const photographerModelGaleryPhoto = galeryFactory(media);
      const userGaleryPhoto =
        photographerModelGaleryPhoto.getUserGaleryLightbox(); /** Création de la carte du média dans le carousel du photographe */
      photographLightbox.appendChild(userGaleryPhoto);
    }
  });

  const mediasLightbox = document.querySelectorAll(".galery-medias");

  /** ---------- Ecouteurs d'évènements pour l'ouverture du carousel ---------- */
  for (let i = 0; i < mediasLightbox.length; i++) {
    mediasLightbox[i].addEventListener("click", () => {
      new Lightbox(
        i,
        mediasLightbox.length
      ); /** Création du carousel selon le média clické grâce à son index et selon le nombre de média pour la longueur du carousel */
      openLightbox(); /** Ouverture du carousel */
    });
    mediasLightbox[i].addEventListener("keydown", (e) => {
      /** Création du carousel selon le média selectionné par la touche "enter" */
      if (e.key === "Enter") {
        new Lightbox(i + 1, mediasLightbox.length);
        openLightbox();
      }
    });
  }
  new Lightbox(); /** Création d'un nouvel objet pour la classe Lightbox */
}

/** ---------- Initialisation pour l'affichage de la galerie de la page photographer.html ---------- */
async function initGalery() {
  const { medias } =
    await getMedias(); /** Récupère les données des médias avant affichage */
  photographGaleryDisplay(
    medias
  ); /** Appel de la fonction d'affichage des données de la galerie */
}
