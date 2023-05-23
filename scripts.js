// Ler o arquivo JSON
fetch("./data/lista_presbiterios.json")
  .then((response) => response.json())
  .then((data) => {
    const presbiterios = data.map((item) => item.nome_presbiterio);

    // Imprimir os nomes dos presbitérios no arquivo index.html
    const listaPresbiterios = document.getElementById("lista-presbiterios");
    presbiterios.forEach((presbiterio) => {
      const item = document.createElement("li");
      item.textContent = presbiterio;
      listaPresbiterios.appendChild(item);
    });
  })
  .catch((error) => console.log(error));
