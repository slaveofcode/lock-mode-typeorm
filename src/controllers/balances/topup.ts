import { Request, Response } from "express";
import { Balance } from '@/entity/balance';
import { AppDataSource } from "@/data-source";
import { EntityManager } from "typeorm";
import { handleQueryLockOpt, QueryLockOptions } from '@/helpers/query-lock-options'
import { sleepSecs } from "@/helpers/sleep-seconds";

const topup = async (manager: EntityManager, balanceId: number, amount: number, options?: QueryLockOptions) => {
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
    
    foundBalance.amount += amount;
    
    await balanceRepo.save(foundBalance);

    if (options) {
        await sleepSecs(options.sleepOnWrite)
    }

    return [foundBalance, null]
};

export default async (req: Request, res: Response) => {
    const { balanceId, amount } = req.body;
    const options = handleQueryLockOpt(req.query);

    console.log(options)

    if (!options.isUseLock) {
        const [resultBalance, message] = await topup(AppDataSource.manager, Number(balanceId), Number(amount));
        if (!resultBalance) {
            return res.status(400).json({ message });
        }

        return res.status(200).json(resultBalance);
    } else {
        return AppDataSource.manager.transaction(options.level, async (manager: EntityManager) => {
            const [resultBalance, message] = await topup(manager, Number(balanceId), Number(amount), options)
            if (!resultBalance) {
                return res.status(400).json({ message });
            }
    
            return res.status(200).json(resultBalance);
        })
    }
}
