
// 1. Seleccionamos los elementos HTML
const generateBtn = document.getElementById("generate-btn");
const colorCount = document.getElementById("color-count");
const paletteContainer = document.getElementById("palette-container");
const feedback = document.getElementById("feedback");
const lockedColors = [];

// 2. Función para generar un color hexadecimal aleatorio
function generateRandomColor() {
    const characters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 16);
        color += characters[randomIndex];
    }

    return color;
}

// 3. Convertimos HEX a HSL
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

// 4. Escuchamos el clic del botón
generateBtn.addEventListener("click", function() {

    // Obtenemos la cantidad seleccionada
    const quantity = Number(colorCount.value);

    // Limpiamos la paleta anterior
    paletteContainer.innerHTML = "";

    // Generamos los colores
    for (let i = 0; i < quantity; i++) {

        const color = lockedColors[i] || generateRandomColor();

        // Creamos una tarjeta para cada color
        const colorCard = document.createElement("div");
        colorCard.classList.add("color-card");

        const hslColor = hexToHSL(color);

        // Mostramos HEX, HSL y botones
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

        // 5. Bloquear y desbloquear colores
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

        // 6. Copiar los colores HEX y HSL
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

        // Agregamos la tarjeta a la página
        paletteContainer.appendChild(colorCard);
    }

    // 7. Mostramos un mensaje
    feedback.textContent = "¡Tu nueva paleta está lista!";
});

// 8. Generamos una paleta al abrir la página
generateBtn.click();
