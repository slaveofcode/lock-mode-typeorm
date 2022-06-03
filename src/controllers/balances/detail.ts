import { Request, Response } from "express";
import { Balance } from '@/entity/balance';
import { AppDataSource } from "@/data-source";

export default async (req: Request, res: Response) => {
    const balance = await AppDataSource.manager.findOne(Balance, {
        where: {
            id: Number(req.params.id),
        }
    });

    return res.status(200).json(balance);
}
