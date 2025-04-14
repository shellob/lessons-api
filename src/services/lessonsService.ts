import db from '../db/knex';

interface FetchLessonsParams {
  date?: string; // "YYYY-MM-DD" или "YYYY-MM-DD,YYYY-MM-DD"
  status?: number;
  teacherIds?: string; // comma-separated ids
  studentsCount?: string; // либо одно число, либо два числа через запятую
  page: number;
  lessonsPerPage: number;
}

interface Lesson {
  id: number;
  date: string;
  title: string;
  status: number;
  visitCount: number;
  students: {
    id: number;
    name: string;
    visit: boolean;
  }[];
  teachers: {
    id: number;
    name: string;
  }[];
}

export const fetchLessons = async (params: FetchLessonsParams): Promise<Lesson[]> => {
  const { date, status, teacherIds, studentsCount, page, lessonsPerPage } = params;

  let query = db('lessons');

  // Фильтр по дате: либо точное совпадение, либо диапазон (две даты через запятую)
  if (date) {
    const dates = date.split(',');
    if (dates.length === 1) {
      query = query.where('date', dates[0]);
    } else if (dates.length === 2) {
      // Определяем порядок дат
      const startDate = dates[0] < dates[1] ? dates[0] : dates[1];
      const endDate = dates[0] < dates[1] ? dates[1] : dates[0];
      query = query.whereBetween('date', [startDate, endDate]);
    }
  }

  // Фильтр по статусу (0 или 1)
  if (typeof status === 'number' && (status === 0 || status === 1)) {
    query = query.where('status', status);
  }

  // Фильтр по teacherIds – выбор занятий, где хотя бы один из учителей присутствует
  if (teacherIds) {
    const teacherIdsArray = teacherIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    if (teacherIdsArray.length > 0) {
      query = query.whereExists(function() {
        this.select('*')
          .from('lesson_teachers')
          .whereRaw('lesson_teachers.lesson_id = lessons.id')
          .whereIn('teacher_id', teacherIdsArray);
      });
    }
  }

  // Фильтр по studentsCount – подсчет количества записанных учеников
  if (studentsCount) {
    const countParts = studentsCount.split(',').map(s => s.trim());
    if (countParts.length === 1) {
      const countNumber = Number(countParts[0]);
      query = query.whereRaw(`(SELECT COUNT(*) FROM lesson_students WHERE lesson_students.lesson_id = lessons.id) = ?`, [countNumber]);
    } else if (countParts.length === 2) {
      const minCount = Number(countParts[0]);
      const maxCount = Number(countParts[1]);
      query = query.whereRaw(`(SELECT COUNT(*) FROM lesson_students WHERE lesson_students.lesson_id = lessons.id) BETWEEN ? AND ?`, [minCount, maxCount]);
    }
  }

  // Пагинация
  const offset = (page - 1) * lessonsPerPage;
  query = query.limit(lessonsPerPage).offset(offset);

  // Получаем основной список занятий
  const lessons = await query.select('*');

  if (lessons.length === 0) return [];

  const lessonIds = lessons.map((lesson: any) => lesson.id);

  // Получаем учителей для всех отобранных занятий одним запросом
  const teachersRows = await db('lesson_teachers')
    .join('teachers', 'lesson_teachers.teacher_id', 'teachers.id')
    .whereIn('lesson_teachers.lesson_id', lessonIds)
    .select('lesson_teachers.lesson_id', 'teachers.id as teacher_id', 'teachers.name as teacher_name');

  // Группируем учителей по lesson_id
  const teachersMap: { [key: number]: { id: number; name: string }[] } = {};
  teachersRows.forEach(row => {
    if (!teachersMap[row.lesson_id]) {
      teachersMap[row.lesson_id] = [];
    }
    teachersMap[row.lesson_id].push({ id: row.teacher_id, name: row.teacher_name });
  });

  // Получаем студентов для всех отобранных занятий
  const studentsRows = await db('lesson_students')
    .join('students', 'lesson_students.student_id', 'students.id')
    .whereIn('lesson_students.lesson_id', lessonIds)
    .select('lesson_students.lesson_id', 'students.id as student_id', 'students.name as student_name', 'lesson_students.visit');

  // Группируем студентов по lesson_id
  const studentsMap: { [key: number]: { id: number; name: string; visit: boolean }[] } = {};
  studentsRows.forEach(row => {
    if (!studentsMap[row.lesson_id]) {
      studentsMap[row.lesson_id] = [];
    }
    studentsMap[row.lesson_id].push({ id: row.student_id, name: row.student_name, visit: row.visit });
  });

  // Собираем итоговый объект с данными для каждого занятия
  const result: Lesson[] = lessons.map((lesson: any) => {
    const students = studentsMap[lesson.id] || [];
    const teachers = teachersMap[lesson.id] || [];
    const visitCount = students.filter(s => Boolean(s.visit)).length;
    return {
      id: lesson.id,
      date: lesson.date,
      title: lesson.title,
      status: lesson.status,
      visitCount,
      students,
      teachers
    };
  });

  return result;
};
