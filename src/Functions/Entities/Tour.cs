using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Functions.Entities {
    [Table(nameof(Tour))]
    public class Tour {
        [Key]
        public int TourId { get; set; }
        public string Name { get; set; }

        public ICollection<Waypoint> Waypoints { get; set; }
    }
}
