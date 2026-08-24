// Salva o telefone com tudo junto, sem espaço
export function normalizePhone(phone: string) {
    return phone.replace(/\D/g, '')
}
