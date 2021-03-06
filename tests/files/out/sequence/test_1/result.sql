CREATE SEQUENCE id_seq MINVALUE 1 MAXVALUE 10000
START WITH
  1 INCREMENT BY 1 CACHE 5;

CREATE SEQUENCE company.engineer_id_seq MAXVALUE 800
START WITH
  800 INCREMENT BY -1 NOCACHE;

GRANT
SELECT
  ON company.engineer_id_seq TO PUBLIC;