import { Router, Request, Response } from 'express';

const router = Router();

router.get('/heroes', (req: Request, res: Response) => {
  res.json({
    status: true,
  });
});

router.get('/heroes/:id', (req: Request, res: Response) => {
  const { params = {} } = req;
  const { id: currentId = 0 } = params;
  res.json({
    status: true,
    id: currentId,
  });
});

export default router;
