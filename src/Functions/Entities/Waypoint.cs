using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Functions.Entities {
    [Table(nameof(Waypoint))]
    public class Waypoint {
        [Key]
        public int WaypointId { get; set; }
        public string Name { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Description { get; set; }
        public bool HasFee { get; set; }
        public bool IsAccessible { get; set; }
        public bool HasParking { get; set; }
        public string Url { get; set; }
        public string TelephoneNumber { get; set; }
        public string Category { get; set; }

        public int TourId { get; set; }
        public Tour Tour { get; set; }
    }
}
