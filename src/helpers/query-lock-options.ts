import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel'

enum Level {
    read_uncommitted = 1,
    read_committed,
    repeatable_read,
    serializable,
}

const QueryLevel = 'level'
const QuerySleepOnRead = 'sleepReadSecs'
const QuerySleepOnWrite = 'sleepWriteSecs'

export interface QueryLockOptions {
    isUseLock: boolean;
    level: IsolationLevel;
    sleepOnRead: number;
    sleepOnWrite: number;
}

export const handleQueryLockOpt = (query): QueryLockOptions => {
    const level = query[QueryLevel];
    const sleepRead = query[QuerySleepOnRead];
    const sleepWrite = query[QuerySleepOnWrite];

    const isUseLock = Boolean(level);

    let lockLevel: IsolationLevel;
    const sleepReadSecs: number = sleepRead ? Number(sleepRead) : 0;
    const sleepWriteSecs: number = sleepWrite ? Number(sleepWrite) : 0;

    switch (Number(level)) {
        case Level.read_committed:
            lockLevel = 'READ COMMITTED';
            break;
        case Level.repeatable_read:
            lockLevel = 'REPEATABLE READ'
            break;
        case Level.serializable:
            lockLevel = 'SERIALIZABLE'
            break;
        case Level.read_uncommitted:
        default:
            lockLevel = 'READ UNCOMMITTED';
            break;
    }

    return {
        isUseLock,
        level: lockLevel,
        sleepOnRead: sleepReadSecs,
        sleepOnWrite: sleepWriteSecs,
    }
}