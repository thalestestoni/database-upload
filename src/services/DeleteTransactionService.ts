import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transaction = transactionRepository.findOne({
      where: { id: transaction_id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepository.delete(transaction_id);
  }
}

export default DeleteTransactionService;
