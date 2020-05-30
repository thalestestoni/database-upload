import { getRepository, getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type === 'outcome') {
      const allTransactions = await transactionsRepository.find();
      const balance = await transactionsRepository.getBalance(allTransactions);

      if (balance?.total && balance?.total < value) {
        throw new AppError('You dont have enough balance');
      }
    }

    let transactionCategory = await categoriesRepository.findOne({
      where: { category },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(transactionCategory);
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
