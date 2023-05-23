let dataArray = [];

function displayIgrejaDetails(igreja) {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "igrejaModal";
  modal.tabIndex = "-1";
  modal.role = "dialog";
  modal.innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${igreja.nome}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ${
            igreja.endereco
              ? `<p><strong>Endereço:</strong> ${igreja.endereco}</p>`
              : ""
          }
          ${igreja.cep ? `<p><strong>CEP:</strong> ${igreja.cep}</p>` : ""}
          ${
            igreja.contato && igreja.contato.telefone
              ? `<p><strong>Telefone:</strong> ${igreja.contato.telefone}</p>`
              : ""
          }
          ${
            igreja.contato && igreja.contato.email
              ? `<p><strong>E-mail:</strong> ${igreja.contato.email}</p>`
              : ""
          }
          ${
            igreja.contato && igreja.contato.website
              ? `<p><strong>Website:</strong> <a href="${igreja.contato.website}" target="_blank">${igreja.contato.website}</a></p>`
              : ""
          }
          ${
            igreja.pastor && igreja.pastor.nome
              ? `<p><strong>Pastor:</strong> ${igreja.pastor.nome}</p>`
              : ""
          }
          ${
            igreja.pastor && igreja.pastor.telefone
              ? `<p><strong>Telefone do Pastor:</strong> ${igreja.pastor.telefone}</p>`
              : ""
          }
          ${
            igreja.pastor && igreja.pastor.celular
              ? `<p><strong>Celular do Pastor:</strong> ${igreja.pastor.celular}</p>`
              : ""
          }
          ${
            igreja.pastor && igreja.pastor.email
              ? `<p><strong>E-mail do Pastor:</strong> ${igreja.pastor.email}</p>`
              : ""
          }
          ${
            igreja.presbiterio && igreja.presbiterio
              ? `<p><strong>Presbitério:</strong> ${igreja.presbiterio}</p>`
              : ""
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  $(`#${modal.id}`).modal("show");

  $(`#${modal.id}`).on("hidden.bs.modal", function () {
    modal.remove();
  });
}

const listDeIgrejas = (data, searchParam) => {
  const plainListOfIgrejas = data.reduce((acc, item) => {
    acc.push(...item.lista_de_igrejas);
    return acc;
  }, []);

  const searchQuery = searchParam.toLowerCase();
  return plainListOfIgrejas.filter((igreja) => {
    const nome = igreja.nome.toLowerCase();
    const endereco = igreja.endereco.toLowerCase();
    const cep = igreja.cep.toLowerCase();
    const presbiterio = igreja.presbiterio.toLowerCase();

    return (
      nome.includes(searchQuery) ||
      endereco.includes(searchQuery) ||
      cep.includes(searchQuery) ||
      presbiterio.includes(searchQuery)
    );
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const listaIgrejasContainer = document.createElement("div");
  listaIgrejasContainer.classList.add("lista-igrejas-container");
  const searchDiv = document.querySelector(".search-div");
  searchDiv.appendChild(listaIgrejasContainer);

  searchInput.addEventListener("input", function (event) {
    const searchParam = event.target.value.trim();

    if (searchParam.length === 0) {
      // Limpa a lista de resultados
      listaIgrejasContainer.innerHTML = "";
      return;
    }

    const filteredIgrejas = listDeIgrejas(dataArray, searchParam);
    renderListaIgrejas(filteredIgrejas);
  });

  function renderListaIgrejas(igrejas) {
    listaIgrejasContainer.innerHTML = "";

    if (igrejas.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "Nenhum resultado encontrado.";
      listaIgrejasContainer.appendChild(noResultsMessage);
    } else {
      igrejas.forEach(function (igreja) {
        const igrejaItem = document.createElement("div");
        igrejaItem.classList.add("igreja-item");

        const igrejaName = document.createElement("span");
        igrejaName.textContent = igreja.nome;
        igrejaItem.appendChild(igrejaName);

        igrejaItem.addEventListener("click", function () {
          displayIgrejaDetails(igreja);
        });

        listaIgrejasContainer.appendChild(igrejaItem);
      });
    }
  }
});

fetch("./data/lista_presbiterios.json")
  .then((response) => response.json())
  .then((data) => {
    dataArray = data;
    const listaPresbiterios = document.getElementById("accordion");
    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header", "bg-dark", "text-white");
      cardHeader.id = `heading${index}`;

      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-link");
      btn.setAttribute("data-toggle", "collapse");
      btn.setAttribute("data-target", `#collapse${index}`);
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-controls", `collapse${index}`);
      btn.textContent = item.nome_presbiterio;

      btn.style.fontSize = "1rem";
      btn.style.fontWeight = "bold";
      btn.style.color = "#fff";

      const cardBody = document.createElement("div");
      cardBody.id = `collapse${index}`;
      cardBody.classList.add("collapse");
      cardBody.setAttribute("aria-labelledby", `heading${index}`);
      cardBody.setAttribute("data-parent", "#accordion");

      const innerCardBody = document.createElement("div");
      innerCardBody.classList.add("card-body");

      if (item.presidente) {
        const presidenteCard = document.createElement("div");
        presidenteCard.classList.add("card", "mb-3");

        const presidenteHeader = document.createElement("div");
        presidenteHeader.classList.add("card-header");
        presidenteHeader.textContent = "Presidente";

        const presidenteCardBody = document.createElement("div");
        presidenteCardBody.classList.add("card-body");

        const presidenteNome = document.createElement("p");
        presidenteNome.classList.add("card-text");
        presidenteNome.textContent = `Nome: ${
          item.presidente.nome || "Não informado"
        }`;

        const presidenteCelular = document.createElement("p");
        presidenteCelular.classList.add("card-text");
        presidenteCelular.textContent = `Celular: ${
          item.presidente.cel || "Não informado"
        }`;

        const presidenteTelefone = document.createElement("p");
        presidenteTelefone.classList.add("card-text");
        presidenteTelefone.textContent = `Telefone: ${
          item.presidente.tel || "Não informado"
        }`;

        const presidenteEmail = document.createElement("p");
        presidenteEmail.classList.add("card-text");
        presidenteEmail.textContent = `E-mail: ${
          item.presidente.email || "Não informado"
        }`;

        presidenteCardBody.appendChild(presidenteNome);
        presidenteCardBody.appendChild(presidenteCelular);
        presidenteCardBody.appendChild(presidenteTelefone);
        presidenteCardBody.appendChild(presidenteEmail);

        presidenteCard.appendChild(presidenteHeader);
        presidenteCard.appendChild(presidenteCardBody);

        innerCardBody.appendChild(presidenteCard);
      }

      if (item.secretario_executivo) {
        const secretarioCard = document.createElement("div");
        secretarioCard.classList.add("card", "mb-3");

        const secretarioHeader = document.createElement("div");
        secretarioHeader.classList.add("card-header");
        secretarioHeader.textContent = "Secretário Executivo";

        const secretarioCardBody = document.createElement("div");
        secretarioCardBody.classList.add("card-body");

        const secretarioNome = document.createElement("p");
        secretarioNome.classList.add("card-text");
        secretarioNome.textContent = `Nome: ${
          item.secretario_executivo.nome || "Não informado"
        }`;

        const secretarioCelular = document.createElement("p");
        secretarioCelular.classList.add("card-text");
        secretarioCelular.textContent = `Celular: ${
          item.secretario_executivo.cel || "Não informado"
        }`;

        const secretarioTelefone = document.createElement("p");
        secretarioTelefone.classList.add("card-text");
        secretarioTelefone.textContent = `Telefone: ${
          item.secretario_executivo.tel || "Não informado"
        }`;

        const secretarioEmail = document.createElement("p");
        secretarioEmail.classList.add("card-text");
        secretarioEmail.textContent = `E-mail: ${
          item.secretario_executivo.email || "Não informado"
        }`;

        secretarioCardBody.appendChild(secretarioNome);
        secretarioCardBody.appendChild(secretarioCelular);
        secretarioCardBody.appendChild(secretarioTelefone);
        secretarioCardBody.appendChild(secretarioEmail);

        secretarioCard.appendChild(secretarioHeader);
        secretarioCard.appendChild(secretarioCardBody);

        innerCardBody.appendChild(secretarioCard);
      }

      if (item.lista_de_igrejas) {
        const igrejasCardBody = document.createElement("div");
        igrejasCardBody.classList.add("card-body");

        item.lista_de_igrejas.forEach((igreja) => {
          const igrejaCard = document.createElement("div");
          igrejaCard.classList.add("card", "mb-3");

          const igrejaCardBody = document.createElement("div");
          igrejaCardBody.classList.add("card-body");

          const igrejaName = document.createElement("h5");
          igrejaName.classList.add("card-title");
          igrejaName.textContent = igreja.nome;
          igrejaCardBody.appendChild(igrejaName);

          const moreInfoButton = document.createElement("button");
          moreInfoButton.classList.add("btn", "btn-primary", "mr-2");
          moreInfoButton.textContent = "Mais informações";
          moreInfoButton.addEventListener("click", () => {
            displayIgrejaDetails(igreja);
          });
          igrejaCardBody.appendChild(moreInfoButton);

          igrejaCard.appendChild(igrejaCardBody);
          igrejasCardBody.appendChild(igrejaCard);
        });

        const igrejasCard = document.createElement("div");
        igrejasCard.classList.add("card", "mb-3");

        const igrejasHeader = document.createElement("h3");
        igrejasHeader.classList.add("card-title", "text-center", "mt-4");
        igrejasHeader.textContent = `Lista de Igrejas do ${item.nome_presbiterio}`;

        igrejasCard.appendChild(igrejasHeader);
        igrejasCard.appendChild(igrejasCardBody);

        innerCardBody.appendChild(igrejasCard);
      }

      cardBody.appendChild(innerCardBody);

      cardHeader.appendChild(btn);
      card.appendChild(cardHeader);
      card.appendChild(cardBody);

      listaPresbiterios.appendChild(card);
    });
  })
  .catch((error) => console.warn(error));
