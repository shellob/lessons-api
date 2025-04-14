import { Request, Response, NextFunction } from 'express';
import { fetchLessons } from '../services/lessonsService';

export const getLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    // Передаем валидированные параметры (обратите внимание, что валидация уже произведена мидлварой)
    const result = await fetchLessons({
      date: filters.date as string | undefined,
      status: filters.status !== undefined ? Number(filters.status) : undefined,
      teacherIds: filters.teacherIds as string | undefined,
      studentsCount: filters.studentsCount as string | undefined,
      page: filters.page !== undefined ? Number(filters.page) : 1,
      lessonsPerPage: filters.lessonsPerPage !== undefined ? Number(filters.lessonsPerPage) : 5
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
