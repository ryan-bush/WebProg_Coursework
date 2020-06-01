-- Up

CREATE TABLE Surveys (
  id   CHAR(128) PRIMARY KEY,
  json TEXT(66555),
  time DATETIME
);

-- Down

DROP TABLE Surveys;

