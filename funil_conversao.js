looker.plugins.visualizations.add({
  id: "funil_conversao",
  label: "Funil de Conversão",

  create: function(element) {
    element.innerHTML =
      '<div id="funil-teste" style="padding:20px;font:16px Arial;">' +
      'Visualização carregada.</div>';
  },

  updateAsync: function(
    data,
    element,
    config,
    queryResponse,
    details,
    done
  ) {
    try {
      var container = element.querySelector("#funil-teste");

      if (container) {
        container.innerHTML =
          "Visualização OK — linhas recebidas: " + data.length;
      }
    } catch (error) {
      element.textContent = "Erro: " + error.message;
    }

    done();
  }
});
