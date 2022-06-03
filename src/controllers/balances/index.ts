import { Router } from 'express';
import List from './list';
import Detail from './detail';
import Create from './create';
import Topup from './topup';
import Redeem from './redeem';

const router = Router({ mergeParams: true })

router.get('/', List);
router.get('/:id', Detail);
router.post('/', Create);
router.post('/topup', Topup);
router.post('/redeem', Redeem);

export default router;
