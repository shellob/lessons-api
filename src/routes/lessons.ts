import { Router } from 'express';
import { getLessons } from '../controllers/lessonsController';
import { validateLessonsQuery } from '../validators/lessonsValidator';

const router = Router();

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Получить список занятий с возможностью фильтрации и пагинации
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Дата или диапазон дат через запятую (формат YYYY-MM-DD)
 *         example: "2019-09-01,2019-09-10"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["0", "1"]
 *         description: Статус занятия (0 — не проведено, 1 — проведено)
 *       - in: query
 *         name: teacherIds
 *         schema:
 *           type: string
 *         description: Список ID учителей через запятую
 *         example: "1,2,3"
 *       - in: query
 *         name: studentsCount
 *         schema:
 *           type: string
 *         description: Одно число или два числа через запятую (для фильтрации по количеству студентов)
 *         example: "3,5"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1)
 *         example: 1
 *       - in: query
 *         name: lessonsPerPage
 *         schema:
 *           type: integer
 *         description: Количество занятий на странице (по умолчанию 5)
 *         example: 10
 *     responses:
 *       200:
 *         description: Успешный ответ. Список занятий.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   title:
 *                     type: string
 *                   status:
 *                     type: integer
 *                   visitCount:
 *                     type: integer
 *                   students:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         visit:
 *                           type: boolean
 *                   teachers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       400:
 *         description: Ошибка валидации параметров запроса
 */

router.get('/', ...validateLessonsQuery, getLessons);

export default router;
