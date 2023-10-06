const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;

const movies = [];
// 將搜尋的監聽器中的 filteredMovies 空陣列 空容器 移到外層變成全域變數
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

function renderMovieList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    // title, Image
    // console.log(item);

    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
                item.id
              }">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${
                item.id
              }">+</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const NumberOfPage = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= NumberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = "${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

// 渲染movie1詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-data");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function addFavoriteMovie(id) {
  //  console.log(id) 確認id是否有無綁對
  // function isMovieSelect(movie) {
  //   return movie.id === id;
  // }
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  // const movie = movies.find(isMovieSelect);
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏敲單");
  }

  list.push(movie);
  // console.log(list); 確認是否有資料放入清單

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

// 點選More 或 add按鈕
dataPanel.addEventListener("click", function onPanelClicked(event) {
  // console.log(event.target);
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addFavoriteMovie(Number(event.target.dataset.id));
  }
});

// 分頁
paginator.addEventListener("click", function onPaginatorClick(event) {
  if (event.target.tagName === !"A") return;
  const page = Number(event.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
});

// 搜尋
searchForm.addEventListener("submit", function onSearchFormSubmit(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  // if (!keyword.length || filteredMovies.length === 0) {
  //   return alert("請輸入有效字串");
  // }
  //搜尋歸零
  filteredUsers.length = 0;
  //利用迴圈將所有電影掃描
  for (const movie of movies)
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie);
    }
  // 條件式filter
  // filteredUsers = users.filter((user) =>
  //   user.name.toLowerCase().includes(keyword)
  // );
  // filteredUsers.filter((user) => user.name.toLowerCase().includes(keyword)); 語法錯誤?

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    // 將所有電影資料放進 movies 陣列裡
    //使用迭代器for of
    // for (const user of response.data.results) {
    //   users.push(user);
    // }
    // 使用...(展開運算子),同樣能達成一樣的效果，且更加彈性
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
    // console.log(movies);
  })
  .catch((err) => console.log(err));
