# 🚀 Megamania Remake

Um jogo de tiro espacial (*shmup*) de tela fixa inspirado no clássico **Megamania** do Atari 2600.

![Gameplay](https://img.shields.io/badge/status-playable-brightgreen)
![Tech](https://img.shields.io/badge/stack-HTML5%20%7C%20Canvas%20%7C%20JS-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🎮 Sobre o Jogo

O jogador controla uma nave na parte inferior da tela, movendo-se lateralmente para destruir ondas inimigas enquanto gerencia sua barra de energia. 

### 🕹️ Mecânicas Principais:
- **Movimentação:** Setas `←` e `→`
- **Tiro:** Tecla `Espaço` ou `Z`
- **Energia:** A barra de energia drena com o tempo. Derrotar uma onda inteira restaura a energia. Se a energia chegar a zero, ou o jogador colidir com um inimigo, perde-se uma vida.
- **Inimigos:** Aparecem descendo em zigue-zague. São 5 tipos com gráficos baseados em Pixel-Art programática (Burger, Cookie, Ferro de passar, Gravata, Diamante).
- **HUD:** Mostra Score, Level atual, Vidas restantes e a Barra de Energia de forma dinâmica.

## 🤖 Processo de Geração do Código (AI Assistant)

Este projeto foi desenvolvido com o auxílio de IA atuando ativamente como Engenheiro de Software, abordando desde a codificação do jogo até a implantação e versionamento, através de prompts iterativos e correções de bugs autônomas.

**Etapas do Desenvolvimento:**
1. **Estrutura Base e Engine Web:** 
   - Criação do layout limpo utilizando `index.html` e CSS puro.
   - Desenvolvimento da Engine via `game.js`, manipulando objetos, colisões retangulares e *sprites* gerados com comandos HTML5 Canvas 2D nativos (eliminando o uso de imagens externas pesadas).
   - Áudios (Laser, Explosão, Morte e Subida de nível) implementados utilizando **Web Audio API** proceduralmente.
2. **Validação Autônoma (Agentes de Browser):** 
   - Para validar se o jogo estava funcionando, a IA abriu uma instância própria de navegador *headless*, capturou *screenshots* jogando o próprio jogo (apertando espaço e se movendo) e reportou o sucesso visual.
3. **Identificação e Resolução de Bugs de Física:** 
   - Durante os testes, foi notado que ao ser atingido com a energia baixa ocorria um travamento/loop na função `triggerDeath()`. A IA realizou refatoração autônoma, adicionou travas de estado (`state === 'dying'`) e configurou o *respawn* para recarregar a energia em 60%, solucionando o caso imediatamente.
4. **DevOps & Integração Contínua Local:** 
   - Foram executados auditorias de segurança para checar vazamento de *secrets* (chaves, senhas).
   - Um arquivo `.gitignore` robusto foi configurado.
   - Foi criado um *script* `.ps1` sob demanda para conectar com segurança a pasta local ao Github do usuário e fazer o Git Push.

## 🚀 Como Executar Localmente

Este é um projeto **100% estático**. Sem instalações, sem `npm install`.

1. Clone o repositório:
   ```bash
   git clone https://github.com/Carlos566487/05-Megamania_Remake.git
   ```
2. Inicie um servidor estático leve (para não sofrer restrições do navegador na manipulação do canvas/audio):
   ```bash
   # Utilizando Python
   python -m http.server 8765
   ```
3. Acesse `http://localhost:8765`.
   *(Se não tiver Python, você pode apenas dar 2 cliques no `index.html` em alguns navegadores que permitam `file://` execution).*

---
*Feito com 💙, JavaScript Puro e Engenharia de Prompts.*