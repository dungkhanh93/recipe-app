import { elements } from './DOM'

export const toggleButton = isLike => {
  //img/icons.svg#icon-heart-outlined
  const iconString = isLike ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.header__likes use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const renderItem = like => {
  const markup = `
  <li data-id=${like.id}>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.author}</p>
        </div>
    </a>
  </li>
  `;

  elements.likeList.insertAdjacentHTML('afterbegin', markup);
}

export const deleteItem = id => {
  const item = document.querySelector(`[data-id="${id}"]`);
  item.parentNode.removeChild(item);
}

export const toggleLikeMenu = numberLike => {
  console.log(numberLike);
  document.querySelector('.likes__field').style.visibility = numberLike ? 'visble' : 'hidden';
}