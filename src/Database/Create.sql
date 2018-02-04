CREATE TABLE Tour (
    [TourId] int NOT NULL PRIMARY KEY,
    [Name] nvarchar(50) NOT NULL
)
GO

CREATE TABLE Waypoint (
    [WaypointId] int NOT NULL PRIMARY KEY,
    [TourId] int NOT NULL FOREIGN KEY REFERENCES Tour,
    [Name] nvarchar(50) NOT NULL,
    Latitude decimal NOT NULL,
    Longitude decimal NOT NULL,
    Description nvarchar(200) NOT NULL,
    HasFee bit NOT NULL,
    IsAccessible bit NOT NULL,
    HasParking bit NOT NULL,
    Url nvarchar(200) NOT NULL,
    TelephoneNumber nvarchar(20) NOT NULL,
    Category nvarchar(20) NOT NULL
)
GO