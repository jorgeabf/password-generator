const input = document.getElementById('password-input')
const span = document.getElementById('password-span')
const range = document.getElementById('password-range')
const button = document.getElementById('password-btn')

const PASSWORD_ARRAY = [
  'a', //1
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k', //11
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u', //21
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E', //31
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O', //41
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y', //51
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8', //61
  '9',
  '+',
  '-',
  '.',
  ',',
  '!',
  ':',
  ';', //71
  '@',
  '·',
  '$',
  '%',
  '&',
  '(',
  ')',
  '?',
  '{',
  '}',
  '[',
  ']',
  '#'
]

const obtenerLogitud = (e) => {
  span.innerHTML = e.target.value
  return e.target.value
}

const generarContrasena = (e) => {
  e.preventDefault()

  const generarNumeroAleatorio = () => {
    let numeroAleatorio = Math.floor(
      Math.random() * PASSWORD_ARRAY.length
    )

    return numeroAleatorio
  }

  let password = ''

  for (let i = 0; i < span.innerHTML; i++) {
    let aleatorio = generarNumeroAleatorio()
    password += PASSWORD_ARRAY[aleatorio]
  }

  input.value = password
}

range.addEventListener('input', obtenerLogitud)
button.addEventListener('click', generarContrasena)
