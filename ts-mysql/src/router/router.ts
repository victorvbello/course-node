import { Router, Request, Response } from 'express';
import Mysql from '../mysql/mysql';

const router = Router();

router.get('/heroes', (req: Request, res: Response) => {
  const query = `
    SELECT * 
    FROM hero
  `;
  Mysql.exe(query, (error: any, heroes: Object[]) => {
    if (error) {
      res.status(400).json({
        success: false,
        error,
      });

    }
    res.json({
      success: true,
      heroes,
    });
  });
});

router.get('/heroes/:id', (req: Request, res: Response) => {
  const { params = {} } = req;
  const { id: currentId = 0 } = params;
  const escapedId = Mysql.instance.cnn.escape(currentId);
  const query = `
    SELECT * 
    FROM hero
    WHERE id = ${escapedId} 
  `;
  Mysql.exe(query, (error: any, result: Object[]) => {
    if (error) {
      res.status(400).json({
        success: false,
        error,
      });
      return;
    }
    const [fistHero = {}] = result;
    res.json({
      success: true,
      hero: fistHero,
    });
  });
});

export default router;
