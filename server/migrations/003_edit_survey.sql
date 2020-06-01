-- Up

ALTER TABLE Surveys
    ADD open INTEGER(2) DEFAULT 1;

ALTER TABLE Surveys
    ADD password VARCHAR(255);

ALTER TABLE Surveys
    ADD deleted INTEGER(2) DEFAULT 0;

--  Down
