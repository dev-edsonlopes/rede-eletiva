CREATE TABLE administrators (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE electives (
    code_elective VARCHAR(7) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_teacher VARCHAR(100) NOT NULL,
    number_vacancies INTEGER NOT NULL,
    module CHAR(1) NOT NULL,
    frame VARCHAR(20) NOT NULL
);

CREATE TABLE students (
    ra VARCHAR(7) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_birth DATE NOT NULL,
    reference_classe VARCHAR(8) NOT NULL,
    module CHAR(1) NOT NULL
);

CREATE TABLE choice_electives (
    ra VARCHAR(7) NOT NULL,
    code_elective VARCHAR(7) NOT NULL,
    PRIMARY KEY (ra, code_elective),
    FOREIGN KEY (ra) REFERENCES public.students (ra),
    FOREIGN KEY (code_elective) REFERENCES public.electives (code_elective)
);

INSERT INTO administrators (id, email, password)
VALUES (1, 'admin_advogadojosedavidgilrodrigues@ete.com', 'ete@21032024');
