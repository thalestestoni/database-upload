import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(
    transactions: Transaction[],
  ): Promise<Balance | null> {
    const income = transactions.reduce((total, transaction) => {
      return transaction.type === 'income' ? total + transaction.value : total;
    }, 0);

    const outcome = transactions.reduce((total, transaction) => {
      return transaction.type === 'outcome' ? total + transaction.value : total;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance || null;
  }
}

export default TransactionsRepository;
