CREATE TABLE Tour (
    [TourId] int NOT NULL PRIMARY KEY,
    [Name] nvarchar(50) NOT NULL
)
GO

CREATE TABLE Waypoint (
    [WaypointId] int NOT NULL PRIMARY KEY,
    [TourId] int NOT NULL FOREIGN KEY REFERENCES Tour,
    [Name] nvarchar(50) NOT NULL,
    Latitude decimal(18,9) NOT NULL,
    Longitude decimal(18,9) NOT NULL,
    Description nvarchar(MAX) NOT NULL,
    HasFee bit NOT NULL,
    IsAccessible bit NOT NULL,
    HasParking bit NOT NULL,
    Url nvarchar(200) NULL,
    TelephoneNumber nvarchar(20) NULL,
    Category nvarchar(20) NOT NULL
)
GO