import { db } from "../db/init";
import { DataTypes, Model } from "sequelize";
import User from "./User";

export default class Transaction extends Model {
  declare id: number;
  declare amount: number;
  declare title: string;
  declare tag: string | null;
  declare type: "income" | "expense";
  declare createdAt: Date;
  declare updatedAt: Date;
  declare userId: number;

  public static getTransaction(
    userId: number,
    tId: number
  ): Promise<Transaction | null> {
    return Transaction.findOne({ where: { userId, id: tId } });
  }

  public static getTransactions(
    userId: number,
    type?: "income" | "expense"
  ): Promise<Transaction[]> {
    return !type
      ? Transaction.findAll({ where: { userId } })
      : Transaction.findAll({ where: { userId, type } });
  }

  public static getTransactionsByMonth(userId: number, month: string) {
    return Transaction.findAll({ where: { userId } }).then((transactions) =>
      transactions.filter((t) => {
        const month_created = t.createdAt.getMonth();
        return month_created + 1 === Number(month);
      })
    );
  }
  public static getTransactionsByWeek(userId: number, date: Date) {
    return Transaction.findAll({ where: { userId } }).then((transactions) =>
      transactions.filter((t) => {
        const getWeekStart = (date: Date): Date => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0); // Normalize time to midnight
          d.setDate(d.getDate() - d.getDay()); // Subtract days to get to Sunday
          return d;
        };

        // Get normalized copies of the input dates
        const date1 = new Date(date);
        const date2 = new Date(t.createdAt);

        // Get the start of each week
        const weekStart1 = getWeekStart(date1);
        const weekStart2 = getWeekStart(date2);
        // Compare the week starts
        return weekStart1.getTime() === weekStart2.getTime();
      })
    );
  }

  public static async getTags(userId: number): Promise<string[]> {
    return Transaction.findAll({
      where: {
        userId,
      },
    }).then((transactions) =>
      Array.from(
        new Set(
          transactions
            .map((t) => t.getDataValue("tag"))
            .filter((tag): tag is string => tag !== null)
        )
      )
    );
  }
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    // Other model options go here
    sequelize: db,
    modelName: "Transaction",
  }
);

(async () => {
  await Transaction.sync();
})();

export type TransactionInsertBody = {
  amount: number;
  title: string;
  tag?: string | null;
  type: "income" | "expense";
  createdAt?: Date;
};

export type TransactionEditBody = {
  id: number;
  amount?: number;
  title?: string;
  tag?: string | null;
  type?: "income" | "expense";
  createdAt?: Date;
};
