import { Request, Response } from "express";
import { Balance } from '@/entity/balance';
import { AppDataSource } from "@/data-source";

export default async (req: Request, res: Response) => {
    const newBalance = new Balance();

    const { personName, amount } = req.body;

    newBalance.personName = personName;
    newBalance.amount = amount;
    newBalance.lastUpdated = new Date();

    await AppDataSource.manager.save(newBalance);

    return res.status(201).json(newBalance);
}
