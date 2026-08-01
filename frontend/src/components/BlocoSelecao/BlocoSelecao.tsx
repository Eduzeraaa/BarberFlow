import './BlocoSelecao.css'

interface BlocoSelecaoProps {
    titulo: string,
    valorSelecionado: string,
    opcoes: string[],
    aoSelecionar: (opcao: string) => void
}

export function BlocoSelecao (props: BlocoSelecaoProps) {
    return (
        <>
            <div>
                <h2>{props.titulo}</h2>
            </div>
            <div className='area-botoes'>
                {props.opcoes.map((opcao) => {

                    if (props.valorSelecionado !== null) {
                        
                    }

                    return <button
                    className={opcao === props.valorSelecionado ? 'selecionado' : ''}
                    onClick={() => props.aoSelecionar(opcao)}
                    >
                        {opcao}
                    </button>
                })}
            </div>
        </>
    )
}
