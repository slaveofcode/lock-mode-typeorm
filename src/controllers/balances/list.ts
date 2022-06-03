import { Request, Response } from "express";
import { Balance } from '@/entity/balance';
import { AppDataSource } from "@/data-source";

export default async (req: Request, res: Response) => {
    const [balances, total] = await AppDataSource.manager.findAndCount(Balance);

    return res.status(200).json({
        data: balances,
        total,
    });
}
