export interface Invoice {
    created: Date
    due: Date
    customer: string 
    company: string 
    item: Item
}

export interface Item {
    name: string 
    cost: number 
    quantity: number
}