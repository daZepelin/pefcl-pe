import { CreateAccountInput } from '@typings/Account';
import { ExternalAccountDB } from '@services/accountExternal/externalAccount.db';
import { singleton } from 'tsyringe';
import { AccountModel } from './account.model';
import { Transaction } from 'sequelize/types';

export interface RemoveFromSharedAccountInput {
  accountId: number;
  identifier: string;
}

@singleton()
export class AccountDB {
  _externalAccountDB: ExternalAccountDB;

  constructor(externalAccountDB: ExternalAccountDB) {
    this._externalAccountDB = externalAccountDB;
  }

  async getAccounts(): Promise<AccountModel[]> {
    return await AccountModel.findAll();
  }

  async getAccountById(id: number): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { id } });
  }

  async getAccountsByIdentifier(identifier: string): Promise<AccountModel[]> {
    return await AccountModel.findAll({ where: { ownerIdentifier: identifier } });
  }

  async getUniqueAccountByIdentifier(identifier: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { ownerIdentifier: identifier } });
  }

  async getDefaultAccountByIdentifier(identifier: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({
      where: { isDefault: true, ownerIdentifier: identifier },
    });
  }

  async getAuthorizedAccountById(id: number, identifier: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { id, ownerIdentifier: identifier } });
  }

  async getAccountByNumber(number: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { number } });
  }

  async createAccount(
    account: CreateAccountInput,
    transaction?: Transaction,
  ): Promise<AccountModel> {
    return await AccountModel.create(account, { transaction });
  }

  async transfer({
    fromAccount,
    toAccount,
    amount,
    transaction,
  }: {
    fromAccount: AccountModel;
    toAccount: AccountModel;
    amount: number;
    transaction: Transaction;
  }) {
    const fromBalance = fromAccount.getDataValue('balance');
    const toBalance = toAccount.getDataValue('balance');
    await fromAccount.update({ balance: fromBalance - amount }, { transaction });
    await toAccount.update({ balance: toBalance + amount }, { transaction });
  }

  async decrement(account: AccountModel, amount: number, transaction?: Transaction) {
    await account?.update({ balance: account.getDataValue('balance') - amount }, { transaction });
  }

  async increment(account: AccountModel, amount: number, transaction?: Transaction) {
    await account?.update({ balance: account.getDataValue('balance') + amount }, { transaction });
  }
}
