import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/BullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { queueManager } from '../context';
import express from 'express';
import simpleAdminAuthMiddleware from '../middleware/simpleAdminAuthMiddleware';

const router = express.Router()

const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: Object.values(queueManager.queues).map(q => new BullMQAdapter(q)),
  serverAdapter:serverAdapter
})

serverAdapter.setBasePath('/admin/bullboard');
router.use('/bullboard', simpleAdminAuthMiddleware, serverAdapter.getRouter());

export default router;