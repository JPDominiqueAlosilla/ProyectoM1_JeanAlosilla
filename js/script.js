
const generateBtn = document.getElementById("generate-btn");
const colorCount = document.getElementById("color-count");
const paletteContainer = document.getElementById("palette-container");
const feedback = document.getElementById("feedback");
const lockedColors = [];

function generateRandomColor() {
    const characters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 16);
        color += characters[randomIndex];
    }

    return color;
}

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

generateBtn.addEventListener("click", function() {

    const quantity = Number(colorCount.value);

    paletteContainer.innerHTML = "";

    for (let i = 0; i < quantity; i++) {

        const color = lockedColors[i] || generateRandomColor();

        const colorCard = document.createElement("div");
        colorCard.classList.add("color-card");

        const hslColor = hexToHSL(color);

        colorCard.innerHTML = `
            <div class="color-preview"
                style="background-color: ${color}">
            </div>

            <div class="color-code">
                <p>HEX: ${color}</p>

                <button class="copy-btn" type="button"
                    data-color="${color}"
                    title="Copiar código HEX">
                    Copiar HEX
                </button>

                <p>HSL: ${hslColor}</p>

                <button class="copy-btn" type="button"
                    data-color="${hslColor}"
                    title="Copiar código HSL">
                    Copiar HSL
                </button>
            </div>

            <button class="lock-btn" type="button"
                aria-label="${lockedColors[i] ? "Desbloquear color" : "Bloquear color"}"
                title="${lockedColors[i] ? "Desbloquear color" : "Bloquear color"}">
                ${lockedColors[i] ? "🔒" : "🔓"}
            </button>
        `;

        const lockBtn = colorCard.querySelector(".lock-btn");

        lockBtn.addEventListener("click", function() {

            if (lockedColors[i]) {
                lockedColors[i] = null;

                lockBtn.textContent = "🔓";
                lockBtn.setAttribute("aria-label", "Bloquear color");
                lockBtn.title = "Bloquear color";

                feedback.textContent = "Color desbloqueado";

            } else {
                lockedColors[i] = color;

                lockBtn.textContent = "🔒";
                lockBtn.setAttribute("aria-label", "Desbloquear color");
                lockBtn.title = "Desbloquear color";

                feedback.textContent = "¡Color bloqueado!";
            }
        });

        const copyButtons = colorCard.querySelectorAll(".copy-btn");

        copyButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                const colorToCopy = button.dataset.color;

                navigator.clipboard.writeText(colorToCopy)
                    .then(function() {
                        feedback.textContent =
                            `¡Color ${colorToCopy} copiado!`;
                    })
                    .catch(function() {
                        feedback.textContent =
                            "No se pudo copiar el color.";
                    });
            });
        });

        paletteContainer.appendChild(colorCard);
    }

    feedback.textContent = "¡Tu nueva paleta está lista!";
});

generateBtn.click();
