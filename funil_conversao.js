looker.plugins.visualizations.add({
  id: "funil_conversao",
  label: "Funil de Conversão",

  create: function(element) {
    console.log("[Funil] create executado");
    element.innerHTML = "Inicializando visualização...";
  },

  updateAsync: function(
    data,
    element,
    config,
    queryResponse,
    details,
    done
  ) {
    console.log("[Funil] updateAsync executado");
    console.log("[Funil] Linhas:", data ? data.length : "data indefinido");
    console.log("[Funil] QueryResponse:", queryResponse);

    try {
      element.innerHTML =
        '<div style="padding:20px;font:16px Arial;color:#102944">' +
        '<h3>Teste da Custom Visualization</h3>' +
        '<p>Linhas recebidas: ' +
        (data ? data.length : 0) +
        '</p>' +
        '<p>updateAsync executado com sucesso.</p>' +
        '</div>';
    } catch (error) {
      console.error("[Funil] Erro de renderização:", error);
      element.textContent = "Erro: " + error.message;
    } finally {
      console.log("[Funil] Chamando done()");
      done();
    }
  }
});
