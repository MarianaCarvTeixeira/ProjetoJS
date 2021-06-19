const searchBaseUrl = "https://api.themoviedb.org/3/search/movie";
const baseUrlApi = "https://api.themoviedb.org/3/movie/";
const apiKey = "?api_key=" + APIKEY;
const languageApi = "&language=pt-BR&include_image_language=pt-BR,null";
const baseUrlImage = "https://image.tmdb.org/t/p/";

function getParameter(parameterName) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function getImage(tamanho = "medio", id = 550) {
    let largura = tamanho !== "medio" ? 1280 : 500;
    return baseUrlImage + "w" + largura + id;
}

async function getMovies(list = "now_playing") {
    let urlApi = baseUrlApi + list + apiKey + languageApi;
    let resultado = await fetch(urlApi);
    return await resultado.json();
}

async function searchMovies(texto) {
    let urlApi = searchBaseUrl + apiKey + "&query=" + texto + "&language=pt-BR";
    let result = await fetch(urlApi);
    let data = await result.json();
    return data;
}

function isPage(pageName) {
    let pathName = window.location.pathname;
    let path = pathName.replace(".html", "");

    return path === pageName;
}

let campoBusca = document.querySelector("#custom-search-input input");
let botaoBusca = document.querySelector("#custom-search-input button");

campoBusca.addEventListener("keydown", (evento) => {
    if (evento.code === "Enter") {
        let textoDaBusca = campoBusca.value;

        window.open("busca.html?busca=" + textoDaBusca, "_self");
    }
});

botaoBusca.addEventListener("click", (evento) => {
    let textoDaBusca = campoBusca.value;

    window.open("busca.html?busca=" + textoDaBusca, "_self");
});

if (isPage("/") || isPage("/index")) {
    const listaWrapper = document.querySelector(".listaFilmes");

    getMovies().then((dados) => {
        let filmesArr = dados.results;

        filmesArr.forEach((filme) => {
            let listItem = document.createElement("div");
            listItem.classList.add("col-lg-3", "col-md-6", "col-sm-12");

            let listaHtml = `
                <a href="filme.html?id=${filme.id}" class="filme">
                    <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                        <div class="mainflip">
                             <div class="frontside">
                                  <div class="card">
                                     <div class="card-body text-center">
                                        <figure>
                                           <img class=" img-fluid" 
                                           src="${getImage("medio", filme.poster_path)}" 
                                           alt="Pôster do filme ${filme.title}"
                                           />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div class="backside">
                                <div class="card">
                                    <div class="card-body text-center mt-4">
                                       <h2>${filme.title}</h2>
                                        <p>                       
                                            <span>${filme.release_date}</span>
                                            <b>Pontos: ${filme.vote_average}</b>
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </a>
            `;

            listItem.innerHTML = listaHtml;

            listaWrapper.appendChild(listItem);
        });
    });
}

if (isPage("/filme")) {
    console.log("página filme ok");

    const filmeId = getParameter("id");

    getMovies(filmeId).then((filme) => {
        //console.log("este é o filme", filme);

        const filmeCapa = document.querySelector("#filme-capa");

        let generos = filme.genres.map((item) => item.name).join(", ");

        let capaHtml = `
      <img
      src="${getImage("", filme.backdrop_path)}"
      alt=""
      srcset=""
    />
    <div class="info">
      <h1>${filme.title}</h1>
      <div class="classificacao">
        <span>${filme.release_date
            }</span> | <span><b>Gênero(s):</b> ${generos}</span>
      </div>
      <p>
      ${filme.overview}
      </p>

    <a  href="${filme.homepage
            }" class="btn btn-primary"><i class="bi bi-link-45deg"></i>Site do filme</a>
    </div>
    
      `;
        console.log(filme);
        filmeCapa.innerHTML = capaHtml;
    });
}

if (isPage("/busca")) {

    let termoDeBusca = getParameter("busca");

    const listaWrapper = document.querySelector(".lista-filmes");
    const textoParametro = document.querySelector("#parametro");
    textoParametro.textContent = termoDeBusca;

    searchMovies(termoDeBusca).then((dados) => {
        let filmesArr = dados.results;

        filmesArr.forEach((filme) => {
            let listItem = document.createElement("div");
            listItem.classList.add("col-md-6", "col-lg-3", "mb-4");

            let listaHtml = `
                <a href="filme.html?id=${filme.id}" class="filme">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                <div class="mainflip">
                     <div class="frontside">
                          <div class="card">
                             <div class="card-body text-center">
                                <figure>
                                   <img class=" img-fluid" 
                                   src="${getImage("medio", filme.poster_path)}" 
                                   alt="Pôster do filme ${filme.title}"
                                   />
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div class="backside">
                        <div class="card">
                            <div class="card-body text-center mt-4">
                               <h2>${filme.title}</h2>
                                <p>                       
                                    <span>${filme.release_date}</span>
                                    <b>Pontos: ${filme.vote_average}</b>
                                </p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            </a>
            `;

            listItem.innerHTML = listaHtml;

            listaWrapper.appendChild(listItem);
        });
    });
}