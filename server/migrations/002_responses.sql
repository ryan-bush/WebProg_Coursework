-- Up

CREATE TABLE Responses (
  id   INTEGER(128) PRIMARY KEY,
  surveyID VARCHAR(128),
  json TEXT(66555),
  time DATETIME
);

-- Down

DROP TABLE Surveys;

