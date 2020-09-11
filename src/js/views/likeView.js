import { elements } from './DOM';

export const toggleButton = isLike => {
  const iconString = isLike ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = like => {
  elements.likeMenu.style.visibility = like ? 'visible' : 'hidden';  
}

export const renderItem = likeItem => {
  const markup = `
  <li data-id=${likeItem.id}>
    <a class="likes__link" href="#${likeItem.id}">
        <figure class="likes__fig">
            <img src="${likeItem.img}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${likeItem.title}</h4>
            <p class="likes__author">${likeItem.author}</p>
        </div>
    </a>
  </li>
  `;

  elements.listLike.insertAdjacentHTML('afterbegin', markup);
}

export const deleteItem = id => {
  const item = document.querySelector(`[data-id="${id}"]`);
  item.parentElement.removeChild(item);
}