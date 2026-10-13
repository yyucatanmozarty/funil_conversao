looker.plugins.visualizations.add({
  id: "funil_conversao",
  label: "Funil de Conversão",

  create: function(element) {
    element.innerHTML = "";
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
      element.innerHTML =
        '<div style="padding:20px;font:16px Arial;color:#102944">' +
        '<h3>Teste da Custom Visualization</h3>' +
        '<p>Linhas recebidas: ' + data.length + '</p>' +
        '<p>updateAsync executado com sucesso.</p>' +
        '</div>';
    } catch (error) {
      element.textContent = "Erro: " + error.message;
    } finally {
      done();
    }
  }
});
