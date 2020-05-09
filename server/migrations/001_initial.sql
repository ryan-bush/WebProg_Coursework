-- Up

CREATE TABLE Surveys (
  id   CHAR(128) PRIMARY KEY,
  json TEXT(66555),
  time DATETIME
);

INSERT INTO Surveys (id, uuid, time) VALUES
( '1',
  'asdfghjkl',
  datetime('now')),
( '2',
  'qwertyuiop',
  datetime('now')),
( '3',
  'jdvamh298fho ',
  datetime('now'));


-- Down

DROP TABLE Surveys;

