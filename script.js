
/* ==========================================================================
   LÓGICA DO SIMULADOR PREVFOGO AGRO
   ========================================================================== */

// 1. Captura dos elementos do DOM de forma semântica e limpa
const btnAnalyze = document.querySelector('#btn-analyze');
const resultDisplay = document.querySelector('#simulator-output');

const inputStrawArea = document.querySelector('#straw-area');
const inputHighwayDistance = document.querySelector('#highway-distance');
const inputWaterTanks = document.querySelector('#water-tanks');

// 2. Adição do Escutador de Eventos (Event Listener) para o clique do botão
btnAnalyze.addEventListener('click', () => {
    
    // Captura e conversão dos valores digitados para números de ponto flutuante
    const strawArea = parseFloat(inputStrawArea.value);
    const highwayDistance = parseFloat(inputHighwayDistance.value);
    const waterTanks = parseFloat(inputWaterTanks.value);

    /* ==========================================================================
       VALIDAÇÃO ESTRITA DE DADOS
       Verifica campos vazios (isNaN) ou valores inconsistentes/negativos
       ========================================================================== */
    if (isNaN(strawArea) || isNaN(highwayDistance) || isNaN(waterTanks)) {
        renderError("Por favor, preencha todos os campos do simulador antes de continuar.");
        return; // Interrompe a execução para evitar cálculos errados (bug)
    }

    if (strawArea < 0 || highwayDistance < 0 || waterTanks < 0) {
        renderError("Os valores informados não podem ser negativos. Verifique os dados digitados.");
        return; // Interrompe a execução
    }

    /* ==========================================================================
       PROCESSAMENTO DOS DADOS (CÁLCULO DE RISCO)
       Baseado em parâmetros reais de prevenção a incêndios rurais
       ========================================================================== */
    let riskPoints = 0;

    // Fator 1: Presença de Palhada Seca (Combustível)
    if (strawArea > 0) {
        riskPoints += 40;
    }

    // Fator 2: Proximidade com Rodovias (Risco de bitucas de cigarro / faíscas)
    if (highwayDistance < 200) {
        riskPoints += 40; // Alto risco se estiver a menos de 200 metros
    } else if (highwayDistance >= 200 && highwayDistance <= 500) {
        riskPoints += 20; // Médio risco
    }

    // Fator 3: Atenuação por Infraestrutura (Tanques de Água diminuem o impacto do risco)
    if (waterTanks > 0) {
        riskPoints -= (waterTanks * 15); // Cada tanque reduz o peso do risco
    }

    // Garantir que a pontuação final fique dentro de limites lógicos (0 a 100)
    let finalScore = Math.max(0, Math.min(riskPoints, 100));

    // Determinação do nível de risco e plano de ação correspondente
    let riskLevel = "";
    let actionPlan = "";

    if (finalScore >= 70) {
        riskLevel = "CRÍTICO E ALTO RISCO";
        actionPlan = "<strong>Ações Urgentes:</strong> É altamente recomendado abrir aceiros de no mínimo 3 metros de largura nas divisas com a rodovia. Remova o excesso de palhada seca perto de construções e estradas. Considere adquirir ou posicionar estrategicamente mais reservatórios de água.";
    } else if (finalScore >= 35 && finalScore < 70) {
        riskLevel = "MODERADO";
        actionPlan = "<strong>Ações Recomendadas:</strong> Mantenha o monitoramento constante nos dias de baixa umidade e ventos fortes. Certifique-se de que seus tanques de água estão cheios e faça a manutenção preventiva de tratores e grades para uso emergencial.";
    } else {
        riskLevel = "BAIXO";
        actionPlan = "<strong>Situação Controlada:</strong> Sua propriedade apresenta boas medidas de contenção ou menor exposição a fatores externos de ignição. Continue praticando o manejo sustentável e apoie os sindicatos rurais locais divulgando práticas seguras.";
    }

    /* ==========================================================================
       RENDERIZAÇÃO ELEGANTE DOS RESULTADOS DIRETAMENTE NA TELA
       ========================================================================== */
    renderSuccess(riskLevel, finalScore, actionPlan);
});

/* ==========================================================================
   FUNÇÕES AUXILIARES DE RENDERIZAÇÃO (UI/UX)
   ========================================================================== */

// Função para exibir aviso de erro amigável na tela do usuário
function renderError(message) {
    resultDisplay.innerHTML = `
        <div class="error-box">
            <p>⚠ <strong>Erro de Validação:</strong> ${message}</p>
        </div>
    `;
}

// Função para exibir o resultado processado de forma elegante
function renderSuccess(level, score, plan) {
    resultDisplay.innerHTML = `
        <div class="success-box">
            <h3>Resultado do Diagnóstico</h3>
            <p><strong>Nível de Risco Identificado:</strong> ${level} (${score} pts)</p>
            <p style="margin-top: 1rem; color: var(--color-text-muted);">${plan}</p>
            <p style="margin-top: 1.5rem; font-size: 0.85rem; border-top: 1px dashed #dee2e6; padding-top: 0.5rem; color: var(--color-primary);">
                💡 <em>Em caso de emergência, ligue imediatamente para o Corpo de Bombeiros (193).</em>
            </p>
        </div>
    `;
}
