

export interface CommonCardInfo {
  card_number: string,
  card_holder: string,
  card_type: string,
}

export interface FinanceDetails extends CommonCardInfo {
  id: string;
  card_balance: number
}

export interface ResponseUserInfo {
  title: string,
  first: string,
  last: string
}

export interface ResponseFinanceDetails {
  amount: string,
  base: string,
  currency: string,
}


