looker.plugins.visualizations.add({
  id: "funil_conversao",
  label: "Funil de Conversão Personalizado",

  options: {
    cor_base: {
      type: "string",
      label: "Cor principal",
      default: "#1769C2"
    }
  },

  create: function(element) {
    element.innerHTML = `
      <style>
        .funil {
          font-family: Arial, sans-serif;
          color: #102944;
          padding: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .funil-linha {
          display: grid;
          grid-template-columns:
            minmax(125px, 0.8fr)
            minmax(180px, 1.5fr)
            minmax(80px, 0.45fr);
          gap: 16px;
          align-items: center;
          margin: 10px 0;
        }

        .funil-nome {
          font-size: 15px;
          font-weight: 700;
        }

        .funil-desc {
          font-size: 12px;
          color: #56718e;
          margin-top: 8px;
        }

        .funil-trilho {
          background: #edf2f7;
          border-radius: 15px;
          height: 52px;
          overflow: hidden;
        }

        .funil-barra {
          height: 100%;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          color: white;
          font-size: 17px;
          font-weight: 700;
          box-sizing: border-box;
        }

        .funil-taxa {
          text-align: right;
          font-size: 18px;
          font-weight: 700;
        }

        .funil-total {
          font-size: 12px;
          color: #56718e;
          margin-top: 5px;
          font-weight: 400;
        }

        .funil-nota {
          color: #56718e;
          font-size: 12px;
          margin-top: 20px;
        }

        @media (max-width: 500px) {
          .funil-linha {
            grid-template-columns: 90px minmax(90px, 1fr) 62px;
            gap: 8px;
          }
          .funil-nome { font-size: 12px; }
          .funil-desc { font-size: 10px; }
          .funil-trilho { height: 42px; }
          .funil-barra { font-size: 14px; }
          .funil-taxa { font-size: 14px; }
        }
      </style>
      <div class="funil"></div>
    `;

    this.container = element.querySelector(".funil");
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
      const fields = [
        ...(queryResponse.fields.dimension_like || []),
        ...(queryResponse.fields.measure_like || [])
      ];

      const findField = (names) =>
        fields.find(f =>
          names.includes(f.name.toLowerCase()) ||
          names.includes((f.label || "").toLowerCase())
        );

      const etapaField = findField([
        "etapa", "stage", "nome_etapa"
      ]) || queryResponse.fields.dimension_like?.[0];

      const valorField = findField([
        "quantidade", "valor", "total", "count", "value"
      ]) || queryResponse.fields.measure_like?.[0];

      const descricaoField = findField([
        "descricao", "description", "subtitulo"
      ]);

      const taxaField = findField([
        "taxa_etapa", "taxa", "taxa_conversao", "percentual"
      ]);

      const totalTaxaField = findField([
        "taxa_total", "percentual_total"
      ]);

      if (!etapaField || !valorField) {
        this.container.innerHTML =
          "Inclua uma dimensão de etapa e uma medida numérica.";
        done();
        return;
      }

      const rows = data.map(row => {
        const get = field =>
          field ? row[field.name]?.value : null;

        return {
          etapa: String(get(etapaField) ?? ""),
          descricao: String(get(descricaoField) ?? ""),
          valor: Number(get(valorField) ?? 0),
          taxa: get(taxaField),
          taxaTotal: get(totalTaxaField)
        };
      });

      const max = Math.max(
        ...rows.map(r => r.valor),
        1
      );

      const cores = [
        "#102B45",
        "#1769C2",
        "#2685DB",
        "#2C9BEF",
        "#0099A8",
        "#E94016"
      ];

      const numero = n =>
        new Intl.NumberFormat("pt-BR", {
          maximumFractionDigits: 1
        }).format(n);

      const percentual = v => {
        if (v === null || v === undefined || v === "") {
          return "—";
        }

        const n = Number(v);
        return Number.isFinite(n)
          ? numero(n) + "%"
          : String(v);
      };

      this.container.innerHTML = `
        <div style="text-align:right;font-size:12px;
                    color:#56718e;margin-bottom:18px">
          Barras proporcionais ao total disparado
        </div>

        ${rows.map((r, i) => {
          const largura = Math.max(0, r.valor / max * 100);
          const taxa = r.taxa !== null &&
                       r.taxa !== undefined &&
                       r.taxa !== ""
            ? percentual(r.taxa)
            : percentual(r.valor / max * 100);

          return `
            <div class="funil-linha">
              <div>
                <div class="funil-nome">
                  ${this.escape(r.etapa)}
                </div>
                <div class="funil-desc">
                  ${this.escape(r.descricao)}
                </div>
              </div>

              <div class="funil-trilho">
                <div class="funil-barra"
                     style="width:${largura}%;
                            background:${i === 0
                              ? "#102B45"
                              : (config.cor_base || cores[i % cores.length])}">
                  ${numero(r.valor)}
                </div>
              </div>

              <div class="funil-taxa">
                ${taxa}
                <div class="funil-total">
                  ${percentual(r.taxaTotal)} total
                </div>
              </div>
            </div>
          `;
        }).join("")}

        <div class="funil-nota">
          A largura de cada barra representa sua participação
          no total da primeira etapa.
        </div>
      `;
    } catch (e) {
      this.container.textContent =
        "Erro ao renderizar o funil: " + e.message;
    } finally {
      done();
    }
  },

  escape: function(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }
});
