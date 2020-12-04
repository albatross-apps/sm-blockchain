//@ts-ignore
import { Storage } from '@stacks/storage'
import { UserSession } from '@stacks/auth'
import { Invoice } from './types'
import { INVOICES_KEY, INVOICES_NUMBER, INVOICE_FILE } from './constants'

export const saveInvoice = async (userSession: UserSession, invoice: Invoice, isPublic: boolean) => {
    const data = {
        invoices: [invoice],
        isPublic: isPublic
    } as any

    const invoicesJson = localStorage.getItem(INVOICES_KEY)
    if (invoicesJson) {
        data.invoices = [...data.invoices, ...(JSON.parse(invoicesJson).invoices) as Invoice[]]
    }
    localStorage.setItem(INVOICES_KEY, JSON.stringify(data))
    const storage = new Storage({userSession})
    await storage.putFile(INVOICE_FILE, JSON.stringify(data), {
        encrypt: !isPublic,
        dangerouslyIgnoreEtag: true,
    })
}

export const fetchInvoices = async (userSession: UserSession, username?: string): Promise<Invoice[]> => {
    try {
        const storage = new Storage({ userSession });
        const invoicesJSON = await storage.getFile(INVOICE_FILE, {
            decrypt: false,
            username: username || undefined,
        })
        if (invoicesJSON) {
            const json = JSON.parse(invoicesJSON)
            if (json.isPublic) {
                return json.invoices as Invoice[]
            } else {
                const decrypt = JSON.parse(await userSession.decryptContent(invoicesJSON) as string)
                localStorage.setItem(INVOICES_KEY, JSON.stringify(decrypt))
                return decrypt.invoices as Invoice[]
            }
        } else {
            return []
        }
    } catch (e) {
        console.error(e); 
        return []
    }
}

export const invoiceNumber = () => {
    return Number(localStorage.getItem(INVOICES_NUMBER)) + 1
}

export const setInvoiceNumver = () => {

}