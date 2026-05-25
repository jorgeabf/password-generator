// Conjuntos de caracteres por tipo. La clave coincide con el data-charset del HTML.
const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '+-.,!:;@·$%&()?{}[]#'
}

const els = {
  range: document.getElementById('password-range'),
  length: document.getElementById('password-length'),
  output: document.getElementById('password-output'),
  generateBtn: document.getElementById('generate-btn'),
  copyBtn: document.getElementById('copy-btn'),
  options: [...document.querySelectorAll('input[data-charset]')],
  strengthBar: document.getElementById('strength-bar'),
  strengthLabel: document.getElementById('strength-label')
}

// Entero aleatorio criptográficamente seguro en [0, max), sin sesgo de módulo.
const randomInt = (max) => {
  const buffer = new Uint32Array(1)
  // Descartamos los valores que caerían en el rango sobrante para no sesgar.
  const limit = Math.floor(0x1_0000_0000 / max) * max
  let value
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)
  return value % max
}

// Baraja in-place (Fisher–Yates) usando aleatoriedad segura.
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const selectedCharsets = () =>
  els.options
    .filter((option) => option.checked)
    .map((option) => CHARSETS[option.dataset.charset])

const updateLength = () => {
  els.length.textContent = els.range.value
}

const updateStrength = (password, poolSize) => {
  // Entropía de Shannon: longitud × log2(tamaño del alfabeto).
  const entropy = password ? password.length * Math.log2(poolSize) : 0

  let level = 'empty'
  let label = '—'
  if (entropy >= 100) {
    level = 'strong'
    label = 'Fuerte'
  } else if (entropy >= 60) {
    level = 'good'
    label = 'Buena'
  } else if (entropy > 0) {
    level = 'weak'
    label = 'Débil'
  }

  els.strengthBar.dataset.level = level
  els.strengthLabel.textContent = label
}

// Activa/desactiva el botón según haya al menos un tipo de carácter elegido.
const syncControls = () => {
  const hasSelection = selectedCharsets().length > 0
  els.generateBtn.disabled = !hasSelection
}

const generate = () => {
  const charsets = selectedCharsets()
  if (charsets.length === 0) return

  const length = Number(els.range.value)
  const pool = charsets.join('')

  // Garantizamos al menos un carácter de cada tipo seleccionado.
  const chars = charsets.map((set) => set[randomInt(set.length)])
  while (chars.length < length) {
    chars.push(pool[randomInt(pool.length)])
  }

  // Si los tipos elegidos superan la longitud, recortamos antes de barajar.
  const password = shuffle(chars).slice(0, length).join('')

  els.output.value = password
  updateStrength(password, pool.length)
  resetCopyButton()
}

let copyResetTimer
const resetCopyButton = () => {
  clearTimeout(copyResetTimer)
  els.copyBtn.dataset.state = 'idle'
}

const copyToClipboard = async () => {
  if (!els.output.value) return
  try {
    await navigator.clipboard.writeText(els.output.value)
    els.copyBtn.dataset.state = 'copied'
    copyResetTimer = setTimeout(resetCopyButton, 1500)
  } catch {
    // Respaldo para contextos sin Clipboard API (p. ej. http://).
    els.output.select()
    document.execCommand('copy')
    els.copyBtn.dataset.state = 'copied'
    copyResetTimer = setTimeout(resetCopyButton, 1500)
  }
}

els.range.addEventListener('input', updateLength)
els.generateBtn.addEventListener('click', generate)
els.copyBtn.addEventListener('click', copyToClipboard)
els.options.forEach((option) =>
  option.addEventListener('change', syncControls)
)

// Estado inicial.
updateLength()
syncControls()
generate()
