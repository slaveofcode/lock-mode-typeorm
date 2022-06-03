import { Request, Response } from "express";
import { Balance } from '@/entity/balance';
import { AppDataSource } from "@/data-source";
import { handleQueryLockOpt, QueryLockOptions } from "@/helpers/query-lock-options";
import { sleepSecs } from "@/helpers/sleep-seconds";
import { EntityManager } from "typeorm";

const redeem = async (manager: EntityManager, balanceId: number, amount: number, options?: QueryLockOptions) => {
    const balanceRepo = manager.getRepository(Balance);
    const foundBalance = await balanceRepo.findOne({
        where: {
            id: balanceId,
        },
    })

    if (options) {
        await sleepSecs(options.sleepOnRead);
    }

    if (!foundBalance) {
        return [false, 'Balance not found']
    }

    if (amount > foundBalance.amount) {
        return [false, 'Unsufficient balance'];
    }
    
    foundBalance.amount -= Number(amount);
    
    await balanceRepo.save(foundBalance);

    if (options) {
        await sleepSecs(options.sleepOnWrite)
    }

    return [foundBalance, null]
};

export default async (req: Request, res: Response) => {
    const { balanceId, amount } = req.body;
    const options = handleQueryLockOpt(req.query);

    if (!options.isUseLock) {
        const [resultBalance, message] = await redeem(AppDataSource.manager, Number(balanceId), Number(amount));
        if (!resultBalance) {
            return res.status(400).json({ message });
        }

        return res.status(200).json(resultBalance);
    } else {
        return AppDataSource.manager.transaction(options.level, async (manager: EntityManager) => {
            const [resultBalance, message] = await redeem(manager, Number(balanceId), Number(amount), options)
            if (!resultBalance) {
                return res.status(400).json({ message });
            }
    
            return res.status(200).json(resultBalance);
        })
    }
}
