// @ts-nocheck
import { Router } from 'express';
import { __MODULE__Controller } from '../controllers/__MODULE__.controller';

const router = Router();
const controller = new __MODULE__Controller();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getOne.bind(controller));

export default router;
