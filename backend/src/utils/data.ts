// Devolve a data de hoje como "AAAA-MM-DD" no fuso da barbearia.
//
// O fuso vem fixo, e não do relógio da máquina: o backend roda dentro de um
// container Linux, que usa UTC. Um new Date().getFullYear() aqui daria a data
// UTC, e depois das 21h isso já é o dia seguinte no Brasil.
//
// O 'en-CA' é um truque conhecido: é o locale cujo formato de data já é
// AAAA-MM-DD, o mesmo que o banco guarda.
export function dataDeHoje() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo'
    }).format(new Date())
}
