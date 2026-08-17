interface Recovery {
    phone : string,
    codeHash: string,
    expiresAt: Date,
    newRequestAt: Date,
    attempts: number
}

export type { Recovery }