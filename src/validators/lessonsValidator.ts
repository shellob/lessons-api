import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const handleValidationErrors: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateLessonsQuery: RequestHandler[] = [
  query('date')
    .optional()
    .custom((value: string) => {
      const dates = value.split(',');
      if (dates.length > 2) {
        throw new Error('Date filter accepts one or two dates separated by comma');
      }
      for (const d of dates) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
          throw new Error('Date format must be YYYY-MM-DD');
        }
      }
      return true;
    }),

  query('status')
    .optional()
    .isIn(['0', '1'])
    .withMessage('Status must be 0 or 1'),

  query('teacherIds')
    .optional()
    .custom((value: string) => {
      const ids = value.split(',');
      for (const id of ids) {
        if (isNaN(Number(id.trim()))) {
          throw new Error('teacherIds must be comma-separated numbers');
        }
      }
      return true;
    }),

  query('studentsCount')
    .optional()
    .custom((value: string) => {
      const parts = value.split(',').map((s) => s.trim());
      if (parts.length < 1 || parts.length > 2) {
        throw new Error('studentsCount must be one number or two numbers separated by comma');
      }
      for (const p of parts) {
        if (isNaN(Number(p))) {
          throw new Error('studentsCount must be numeric');
        }
      }
      return true;
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be an integer starting from 1'),

  query('lessonsPerPage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('lessonsPerPage must be a positive integer'),

  handleValidationErrors
];
