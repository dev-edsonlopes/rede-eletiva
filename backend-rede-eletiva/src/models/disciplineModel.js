import sql from "../config/db.js";

export class DiciplineModel {
  async findDiciplinesClasse(module) {
    let query = await sql`
    SELECT 
      e.code_elective,
      e.name AS name_elective,
      e.name_teacher,
      e.module,
      e.number_vacancies AS total_vacancies,
      COUNT(s.ra) AS filled_vacancies,
      e.number_vacancies - COUNT(s.ra) AS available_vacancies,
      e.frame
    FROM 
      electives e
    LEFT JOIN 
      choice_electives AS ce
        ON ce.code_elective = e.code_elective
    LEFT JOIN
      students AS s
        ON s.ra = ce.ra
        ${!module ? sql`` : sql`WHERE e.module = ${module}`}
    GROUP BY 
      e.code_elective, e.name, e.number_vacancies
      ORDER BY 
        CASE 
          WHEN e.frame = 'segunda-feira' THEN 1
          WHEN e.frame = 'terça-feira' THEN 2
          WHEN e.frame = 'quarta-feira' THEN 3
          WHEN e.frame = 'quinta-feira' THEN 4
          WHEN e.frame = 'sexta-feira' THEN 5
        END`;

    return query;
  }

  async checkVacanciesDiscipline(code_elective, data) {
    const disciplines = await this.findDiciplinesClasse(data.module);

    const findDisciplineSelect = disciplines.find(
      (result) => result.code_elective === code_elective
    );

    if (findDisciplineSelect) {
      return findDisciplineSelect.available_vacancies > 0;
    } else {
      return false;
    }
  }

  async registerElectives(data) {
    const { name, name_teacher, number_vacancies, module, frame } = data;

    // Verificar e criar a sequência se não existir
    await sql`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'code_elective_seq') THEN
            CREATE SEQUENCE code_elective_seq;
        END IF;
    END $$;
    `;

    // Obter o próximo valor da sequência
    const result = await sql`
    SELECT NEXTVAL('code_elective_seq') AS next_val;
    `;
    const nextVal = result[0].next_val;

    // Formatar o código da eletiva
    const codeElective = `EEM${nextVal.toString().padStart(4, "0")}`;

    // Inserir a nova eletiva
    const query = await sql`
    INSERT INTO electives("code_elective", "name", name_teacher, number_vacancies, "module", frame) 
    VALUES (${codeElective}, ${name}, ${name_teacher}, ${number_vacancies}, ${module}, ${frame});
    `;

    return query;
  }

  async update(id, data) {
    const { name, name_teacher, number_vacancies, module, frame } = data;

    const query = await sql`
        UPDATE electives 
        SET name = ${name}, 
            name_teacher = ${name_teacher}, 
            number_vacancies = ${number_vacancies}, 
            module = ${module}, 
            frame = ${frame}
        WHERE code_elective = ${id};
    `;
    return query;
  }

  async delete(id) {
    try {
      await sql`DELETE FROM choice_electives WHERE code_elective = ${id}`;
      await sql`DELETE FROM electives WHERE code_elective = ${id}`;
      return true;
    } catch (error) {
      throw error;
    }
  }
}
