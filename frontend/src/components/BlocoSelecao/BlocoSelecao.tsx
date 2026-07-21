import './BlocoSelecao.css'

interface BlocoSelecaoProps {
    titulo: string,
    confirmacao: string,
    opcoes: string[],
    aoSelecionar: (opcao: string) => void
}

export function BlocoSelecao (props: BlocoSelecaoProps) {
    return (
        <>
            <div>
                <h2>{props.titulo}</h2>
            </div>
            <div className='botoes-barbeiros'>
                {props.opcoes.map((opcao) => {
                    return <button onClick={() => props.aoSelecionar(opcao)}>{opcao}</button>
                })}
            </div>
            
            <p>Escolha: {props.confirmacao}</p>
        </>
    )
}
