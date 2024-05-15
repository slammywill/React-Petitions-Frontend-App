
type Petition = {
    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: string,
    supportingCost: number,
    description: string
}

type SupportTier = {
    title: string,
    description: string,
    cost: number,
    supportTierId: number
}

type SinglePetition = {
    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: string,
    description: string,
    moneyRaised: number,
    supportTiers: SupportTier[]
}

type Supporter = {
    supportId: number,
    supportTierId: number,
    message: string,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: string
}
