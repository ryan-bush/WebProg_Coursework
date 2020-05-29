-- Up

ALTER TABLE Surveys
    ADD open INTEGER(2) DEFAULT 0;

ALTER TABLE Surveys
    ADD password VARCHAR(255);

--  Down
