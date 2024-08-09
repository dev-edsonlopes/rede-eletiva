import sql from "../config/db.js";

export class StudentsModel {
  async validateStudents(ra, date_birth) {
    try {
      const result = await sql`
                SELECT * FROM students WHERE ra = ${ra} AND date_birth = ${date_birth}
            `;

      return result;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async registerDiscipline(ra, code_elective, frame) {
    try {
      console.log(
        "Received values - RA:",
        ra,
        "Code Elective:",
        code_elective,
        "Frame:",
        frame
      );

      const result =
        await sql`SELECT frame FROM electives WHERE code_elective = ${code_elective}`;

      if (result.length === 0) {
        throw new Error("No frame found for the given elective code");
      }

      const [{ frame: electiveFrame }] = result;
      console.log("Elective Frame from DB:", electiveFrame);

      const verifySelection = await this.isEnrolledInElective(
        ra,
        electiveFrame
      );
      console.log("Verify Selection:", verifySelection);

      if (!verifySelection) {
        await sql`
          INSERT INTO choice_electives (ra, code_elective, frame) 
          VALUES (${ra}, ${code_elective}, ${electiveFrame})
        `;
      } else {
        await sql`
          UPDATE choice_electives 
          SET code_elective = ${code_elective}, frame = ${electiveFrame} 
          WHERE ra = ${ra} AND
          frame = ${electiveFrame}
        `;
      }
    } catch (error) {
      console.error("Erro no modelo:", error.message);
    }
  }

  async isEnrolledInElective(ra, frame) {
    const verifyStudent = await sql`
    SELECT COUNT(*) AS count
    FROM choice_electives AS ce 
    WHERE ce.ra = ${ra} AND
    ce.frame = ${frame};
  `;

    return verifyStudent[0].count > 0;
  }

  async getStudent(ra) {
    try {
      const student = await sql`SELECT * FROM students  WHERE ra = ${ra}`;

      const electives =
        await sql`SELECT frame, code_elective FROM choice_electives WHERE ra = ${ra}`;

      student[0].electives = {};

      if (electives && electives.length > 0) {
        electives.forEach((e) => {
          student[0].electives[e.frame] = e.code_elective;
        });
      } else {
        student.forEach((e) => {
          student[0].electives = false;
        });
      }
      console.log("student", student);
      return student;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllStudents() {
    try {
      const allStudents = await sql`
        SELECT 
          s.ra,
          s.name,
          s.reference_classe,
          s.module,
          e.name AS name_elective,
          CASE 
                WHEN ce.ra IS NOT NULL THEN TRUE
                ELSE FALSE
            END AS is_registered
        FROM students AS s
        LEFT JOIN choice_electives AS ce
          ON ce.ra = s.ra
        LEFT JOIN electives AS e
          ON e.code_elective = ce.code_elective
        ORDER BY s."name"
        `;

      return allStudents;
    } catch (error) {
      console.log(error.message);
    }
  }

  async create(data) {
    try {
      const { ra, name, date_birth, reference_classe, module } = data;

      if (!ra || !name || !date_birth || !reference_classe || !module) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthDateRegex.test(date_birth)) {
        throw new Error("Formato de data de nascimento inválido.");
      }

      // // Remover registros da tabela choice_electives relacionados ao reference_classe
      // await sql`
      //     DELETE FROM choice_electives
      //     WHERE ra IN (
      //       SELECT ra
      //       FROM students
      //       WHERE reference_classe = ${reference_classe}
      //     );
      //   `;

      // // Remover registros da tabela students com o reference_classe
      // await sql`
      //     DELETE FROM students
      //     WHERE reference_classe = ${reference_classe};
      //   `;

      // Inserir novos dados
      return await sql`
        INSERT INTO students (ra, name, date_birth, reference_classe, module)
        VALUES (${ra}, ${name}, ${date_birth}, ${reference_classe}, ${module})
        `;
    } catch (error) {
      console.error("Erro no modelo:", error.message);
      throw error;
    }
  }

  async itemFilterStudents() {
    try {
      return {
        reference_classe:
          await sql`SELECT DISTINCT reference_classe FROM students ORDER BY reference_classe;`,
        module:
          await sql`SELECT DISTINCT "module" FROM students ORDER BY "module";`,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}
