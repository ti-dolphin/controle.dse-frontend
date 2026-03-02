export const textMeasurer = (font = '11px Roboto') => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Erro ao criar contexto de medição de texto')
  }

  context.font = font

  return (text:string) => context.measureText(text).width
}
