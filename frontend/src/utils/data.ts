// Devolve a data de hoje como "AAAA-MM-DD", no fuso do usuário.
//
// Não use toISOString() para isso: ele converte para UTC, e o Brasil
// está 3 horas atrás. Depois das 21h o UTC já virou o dia seguinte,
// então toISOString() diria que "hoje" é amanhã.
export function dataDeHoje() {
    const agora = new Date()

    const ano = agora.getFullYear()
    const mes = String(agora.getMonth() + 1).padStart(2, '0')
    const dia = String(agora.getDate()).padStart(2, '0')

    return `${ano}-${mes}-${dia}`
}
